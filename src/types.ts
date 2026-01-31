export interface Feedback {
  id: number;
  datasource: string;
  url: string;
  content: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
  tags: string | null;
  sentiment: number | null;
  urgency: number | null;
  status: string;
  assignee: string | null;
}

export interface Env {
  DB: D1Database;
  AI: Ai;
  FEEDBACK_ANALYSIS_WORKFLOW: Workflow;
}
