import {
  getRepoDetails,
  getRepoTree,
  getFileContent,
  getLanguages,
  pickImportantFiles,
} from "../../lib/github";
import { callGemini } from "../../lib/gemini";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { owner, repo } = body;

    if (!owner || !repo) {
      return Response.json(
        { error: "owner and repo are required" },
        { status: 400 },
      );
    }

    // 1. Get repo details (need default_branch before we can get the tree)
    const repoDetails = await getRepoDetails(owner, repo);
    const defaultBranch = repoDetails.default_branch;

    // 2. Get full file tree, then filter down to the important files
    const tree = await getRepoTree(owner, repo, defaultBranch);
    if (tree.length === 0) {
      return Response.json(
        { error: "This repository appears to be empty — nothing to analyze yet." },
        { status: 422 },
      );
    }
    const totalFileCount = tree.filter((f) => f.type === "blob").length;
    const importantFiles = pickImportantFiles(tree);

    // 3. Fetch contents of those files (skip any that fail individually)
    const fileContents = await Promise.all(
      importantFiles.map(async (file) => {
        const content = await getFileContent(owner, repo, file.path);
        return content ? { path: file.path, content } : null;
      }),
    );
    const validFiles = fileContents.filter(
      (f): f is { path: string; content: string } => f !== null,
    );

    // 4. Get language breakdown (only needed here, not in the list view)
    const languages = await getLanguages(owner, repo);

    // 5. Build the prompt for Gemini
    const filesBlock = validFiles
      .map((f) => `--- ${f.path} ---\n${f.content}`)
      .join("\n\n");

    const prompt = `You are a senior software engineer analyzing a GitHub repository to help its owner present it in a job application. Your audience is a technical recruiter or hiring manager who will skim this, not read deeply.

Repo: ${owner}/${repo}
Description: ${repoDetails.description ?? "none provided"}
Languages used: ${Object.keys(languages).join(", ")}

Files from the repo:
${filesBlock}

Analyze the code and produce output in EXACTLY this JSON structure, with no text before or after the JSON object, no markdown code fences, and no trailing commas:

{
  "summary": "3-5 sentences covering: (1) what problem the project solves, (2) how it's architected at a high level, (3) one or two technical decisions worth highlighting. Write in third person, factual tone, as if describing someone else's work for their resume.",
  "keySkillsDemonstrated": ["3 to 6 specific skills, e.g. 'REST API design', 'Async data fetching' — avoid vague entries like 'coding'"],
  "keyModules": [
    { "name": "Short module or file name", "description": "One sentence on what this part does" }
  ],
  "notableDecisions": [
    "2-4 short callouts on specific, interesting engineering choices and why they matter — e.g. 'Uses DuckDB instead of a full database for zero-setup local queries'. Skip this array entirely (empty array) if nothing genuinely notable stands out — don't invent filler."
  ]
}

Rules:
- Base your analysis only on the files provided. If something is unclear, do not guess or invent details.
- keyModules should cover 3-6 of the most important pieces, ordered roughly by importance (entry point first, if identifiable).
- If the repo appears to be a template, tutorial clone, or has very little custom code, say so honestly in the summary rather than overstating its complexity.`;
    // 6. Call Gemini and parse its JSON response
    const rawResponse = await callGemini(prompt);
    const cleaned = rawResponse.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", cleaned);
      return Response.json(
        { error: "AI response was not in the expected format, try again" },
        { status: 502 },
      );
    }

    // 7. Return combined result
    const hasReadme = validFiles.some((f) => f.path.toLowerCase().includes("readme"));

    return Response.json(
      {
        owner,
        repo,
        languageBreakdown: languages,
        summary: parsed.summary,
        keySkillsDemonstrated: parsed.keySkillsDemonstrated,
        keyModules: parsed.keyModules,
        notableDecisions: parsed.notableDecisions,
        totalFileCount,
        lastPush: repoDetails.pushed_at,
        repoSizeKb: repoDetails.size, // GitHub returns this in KB already
        hasReadme,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in /api/analyze:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
