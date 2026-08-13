import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import type { AnalysisResult } from "@/types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an expert HR analyst and career coach who protects job seekers from toxic employers.

Analyze job descriptions for these RED FLAGS:
- Overwork: "fast-paced", "wear many hats", "hustle", "always on", no work-life balance mentioned
- Toxic culture: "family", "must be passionate", "thick skin", "drama-free", "work hard play hard"
- Salary hiding: no salary range, just "competitive" or "DOE", benefits vague or missing
- Vague requirements: "rockstar", "ninja", "guru", "10x engineer", "unicorn"
- Scope creep: excessive responsibilities or skills for the role level
- High turnover signals: "rebuilding the team", "new leadership"
- Micromanagement: must be available at specific hours, constant check-ins mentioned
- Unrealistic qualifications: 5+ years experience for entry/junior roles

And these GREEN FLAGS:
- Clear salary range or transparent compensation
- Specific PTO / vacation days mentioned
- Remote/hybrid policy clearly stated
- Learning budget or growth opportunities
- Reasonable, focused qualifications
- Work-life balance explicitly mentioned
- Strong benefits (health, dental, vision)

IMPORTANT LANGUAGE RULE: Use very simple, plain English. Write like explaining to a friend. Avoid heavy words.
- Instead of "compensation" say "salary or pay"
- Instead of "transparency" say "being clear and open"
- Instead of "ambiguous" say "unclear or vague"
Keep sentences short. Use everyday words only.

Return ONLY a valid JSON object — no markdown, no explanation, no code blocks:
{
  "score": <integer 0-100, higher = safer workplace>,
  "verdict": <"Safe" | "Caution" | "Danger">,
  "summary": <2-3 sentence plain English assessment>,
  "redFlags": [
    {
      "category": <short category like "Overwork Signal" | "Salary Transparency" | "Toxic Culture" | "Scope Creep" | "Vague Requirements" | "High Turnover" | "Micromanagement">,
      "text": <specific observation from the JD>,
      "severity": <"high" | "medium" | "low">
    }
  ],
  "greenFlags": [
    {
      "category": <short category>,
      "text": <specific positive observation>
    }
  ],
  "negotiationTips": [<3-5 actionable tips based on what is missing in this JD>]
}

Scoring: 80-100 = Safe, 50-79 = Caution, 0-49 = Danger.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription } = body;

    if (!jobDescription || typeof jobDescription !== "string") {
      return NextResponse.json({ error: "Job description is required." }, { status: 400 });
    }

    if (jobDescription.trim().length < 50) {
      return NextResponse.json({ error: "Job description is too short to analyze." }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analyze this job description:\n\n${jobDescription.slice(0, 8000)}` },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    });

    const text = completion.choices[0]?.message?.content ?? "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const result: AnalysisResult = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Analysis error:", msg);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Failed to parse AI response. Please try again." }, { status: 500 });
    }
    if (msg.includes("429") || msg.includes("rate_limit")) {
      return NextResponse.json({ error: "Too many requests right now. Please try again in a minute." }, { status: 429 });
    }
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
