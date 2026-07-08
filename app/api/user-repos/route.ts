import { extractUsername } from "../../../components/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userLink } = body;

    if (!userLink) {
      return Response.json({ error: "userLink is required" }, { status: 400 });
    }

    const owner = extractUsername(userLink);
    if (!owner) {
      return Response.json({ error: "Invalid GitHub username or URL" }, { status: 400 });
    }

    const repoRes = await fetch(
      `https://api.github.com/users/${owner}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

    console.log("Rate limit remaining:", repoRes.headers.get("x-ratelimit-remaining"));

    if (!repoRes.ok) {
      return Response.json(
        { error: `GitHub account not found or inaccessible (status ${repoRes.status})` },
        { status: repoRes.status },
      );
    }

    const repoListData = await repoRes.json();

    const repos = repoListData
      .filter((repo: any) => !repo.fork)
      .map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        ownerLogin: repo.owner?.login ?? owner,
        htmlUrl: repo.html_url,
        description: repo.description || "No description provided",
        language: repo.language,
        isFork: repo.fork,
        lastUpdated: repo.updated_at,
        lastPush: repo.pushed_at,
        stars: repo.stargazers_count,
      }));

    return Response.json(repos, { status: 200 });
  } catch (error) {
    console.error("Error in /api/user-repos:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}