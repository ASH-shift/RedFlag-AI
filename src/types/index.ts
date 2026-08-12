export interface RedFlag {
  category: string;
  text: string;
  severity: "high" | "medium" | "low";
}

export interface GreenFlag {
  category: string;
  text: string;
}

export interface AnalysisResult {
  score: number;
  verdict: "Safe" | "Caution" | "Danger";
  summary: string;
  redFlags: RedFlag[];
  greenFlags: GreenFlag[];
  negotiationTips: string[];
}
