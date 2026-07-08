# RepoLens

Turn any public GitHub profile into a portfolio-ready breakdown : architecture, key skills, and tech stack, generated automatically for every public project.

Paste a GitHub username or profile link, browse someone's public repos in a clean card view, and click **Analyze** on any project to get an AI-generated summary written the way a recruiter would want to read it: what the project does, the key skills it demonstrates, notable engineering decisions, and a full language breakdown.

## Features

-  __Browse any public GitHub profile__ : paste a username or full profile URL
-  **Filter and sort** repos by language, last updated, or hide forks
-  **AI-generated project summaries** : recruiter-facing, factual, no hype
-  **Key modules breakdown** : a plain-English rundown of a project's main pieces
-  **Notable engineering decisions** : callouts on interesting technical choices
-  **Language distribution charts** : both per-project and across an entire profile
-  **Light and dark themes** : persists across sessions, respects system preference
-  **Fully responsive** : works cleanly on mobile, tablet, and desktop

## Tech stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Theming:** next-themes
- **AI:** Google Gemini API (`gemini-2.5-flash`)
- **Data source:** GitHub REST API
- **Icons:** Lucide