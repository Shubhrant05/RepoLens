export async function POST(request: Request) {
  try {
    // 1. Read input
    const body = await request.json();
    const { repoUrl } = body;

    if (!repoUrl) {
      return Response.json(
        { error: "repoUrl is required" },
        { status: 400 }
      );
    }

    // 2. Parse owner/repo from the URL
    // e.g. https://github.com/vercel/next.js -> owner=vercel, repo=next.js
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      return Response.json(
        { error: "Invalid GitHub repo URL" },
        { status: 400 }
      );
    }
    const owner = match[1];
    const repo = match[2].replace(/\.git$/, ""); // strip trailing .git if present

    // 3. Fetch repo details from GitHub
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!repoRes.ok) {
      return Response.json(
        { error: `GitHub repo not found or inaccessible (status ${repoRes.status})` },
        { status: repoRes.status }
      );
    }

    const repoData = await repoRes.json();
    const defaultBranch = repoData.default_branch;

    // 4. Return what we have so far (we'll extend this with tree + Gemini next)
    return Response.json({
      owner,
      repo,
      defaultBranch,
      description: repoData.description,
      language: repoData.language,
    });

  } catch (error) {
    console.error("Error in /api/analyze:", error);
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}