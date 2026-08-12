import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import type { AnalysisResult } from "@/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `You are an expert HR analyst and career coach who protects job seekers from toxic employers.

Analyze job descriptions for these RED FLAGS:
- Overwork: "fast-paced", "wear many hats", "hustle", "always on", no work-life balance mentioned
- Toxic culture: "family", "must be passionate", "thick skin", "drama-free" (usually means drama exists), "work hard play hard"
- Salary hiding: no salary range, just "competitive" or "DOE", benefits vague or missing
- Vague requirements: "rockstar", "ninja", "guru", "10x engineer", "unicorn"
- Scope creep: excessive responsibilities or skills for the role level
- High turnover signals: "rebuilding the team", "new leadership", unusually high headcount emphasis
- Micromanagement: must be available at specific hours, constant check-ins mentioned
- Unrealistic qualifications: 5+ years experience for entry/junior roles, too many stacked tech requirements

And these GREEN FLAGS:
- Clear salary range or transparent compensation
- Specific PTO / vacation days mentioned
- Remote/hybrid policy clearly stated
- Learning budget, conferences, or growth opportunities
- Reasonable, focused qualifications
- Work-life balance explicitly mentioned
- Strong benefits (health, dental, vision, 401k)
- Clear reporting structure

IMPORTANT LANGUAGE RULE: Use very simple, plain English in ALL your responses. Write like you are explaining to a friend who is not a native English speaker. Avoid heavy, complex, or formal words. For example:
- Instead of "compensation" → say "salary or pay"
- Instead of "transparency" → say "being clear and open"
- Instead of "ambiguous" → say "unclear or vague"
- Instead of "leverage" → say "use this to your advantage"
- Instead of "discrepancy" → say "mismatch or difference"
Keep sentences short. Use everyday words only.

Return ONLY a valid JSON object — no markdown, no explanation, no code blocks. Exact structure:
{
  "score": <integer 0-100, higher = safer workplace>,
  "verdict": <"Safe" | "Caution" | "Danger">,
  "summary": <2-3 sentence plain English assessment a job seeker would find useful>,
  "redFlags": [
    {
      "category": <short category like "Overwork Signal" | "Salary Transparency" | "Toxic Culture" | "Scope Creep" | "Vague Requirements" | "High Turnover" | "Micromanagement">,
      "text": <specific observation tied to exact language in the JD>,
      "severity": <"high" | "medium" | "low">
    }
  ],
  "greenFlags": [
    {
      "category": <short category>,
      "text": <specific positive observation>
    }
  ],
  "negotiationTips": [<3-5 actionable tips based on what is specifically missing or vague in THIS job description>]
}

Scoring: 80-100 = Safe, 50-79 = Caution, 0-49 = Danger. Be honest and specific.`;

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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this job description:\n\n${jobDescription.slice(0, 8000)}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    const text = response.text ?? "";

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
    return NextResponse.json({ error: `Analysis failed: ${msg}` }, { status: 500 });
  }
}
