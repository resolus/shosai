CREATE TABLE users (
  id TEXT PRIMARY KEY,           -- Google の sub (ユーザーID)
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  picture TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
