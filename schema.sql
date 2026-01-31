DROP TABLE IF EXISTS feedback;

CREATE TABLE feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  datasource TEXT NOT NULL,
  url TEXT DEFAULT '',
  content TEXT NOT NULL,
  summary TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  tags TEXT,
  sentiment REAL,
  urgency INTEGER,
  status TEXT DEFAULT 'new',
  assignee TEXT
);

CREATE INDEX idx_feedback_datasource ON feedback(datasource);
CREATE INDEX idx_feedback_sentiment ON feedback(sentiment);
CREATE INDEX idx_feedback_urgency ON feedback(urgency);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_assignee ON feedback(assignee);
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX idx_feedback_updated_at ON feedback(updated_at DESC);
