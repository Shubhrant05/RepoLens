import { getRepoDetails, getRepoTree, getLanguages } from "../../lib/github";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { owner, repo } = body;

    if (!owner || !repo) {
      return Response.json({ error: "owner and repo are required" }, { status: 400 });
    }

    const repoDetails = await getRepoDetails(owner, repo);
    const tree = await getRepoTree(owner, repo, repoDetails.default_branch);

    if (tree.length === 0) {
      return Response.json(
        { error: "This repository appears to be empty, nothing to analyze yet." },
        { status: 422 },
      );
    }

    const totalFileCount = tree.filter((f) => f.type === "blob").length;
    const hasReadme = tree.some((f) => f.type === "blob" && /readme/i.test(f.path));
    const languages = await getLanguages(owner, repo);

    return Response.json(
      {
        owner,
        repo,
        languageBreakdown: languages,
        totalFileCount,
        lastPush: repoDetails.pushed_at,
        repoSizeKb: repoDetails.size,
        hasReadme,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in /api/repo-metadata:", error);
    return Response.json({ error: "Couldn't load repo details" }, { status: 500 });
  }
}