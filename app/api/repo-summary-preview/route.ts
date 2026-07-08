// app/api/repo-summary-preview/route.ts

import { callGemini } from "../../lib/gemini";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, language } = body;

    if (!name) {
      return Response.json({ error: "name is required" }, { status: 400 });
    }

    // no description at all? skip the AI call entirely, don't waste quota
    if (!description || description === "No description provided") {
      return Response.json({ preview: "No description available for this project." });
    }

    const prompt = `Write a 2-3 sentence summary of a coding project for a portfolio/job application context.
Project name: ${name}
Primary language: ${language ?? "unknown"}
Description: ${description}

Keep it concise, professional, and focused on what the project does. Do not repeat the project name unnecessarily.`;

    const preview = await callGemini(prompt);

    return Response.json({ preview: preview.trim() }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/repo-summary-preview:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}