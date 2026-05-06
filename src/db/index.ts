import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '../../memory/memory.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    period TEXT DEFAULT '',
    criteria TEXT DEFAULT '',
    weight REAL DEFAULT 0,
    ai_suggestion TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    result TEXT DEFAULT '',
    self_evaluation TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_id INTEGER,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    ai_suggestion TEXT DEFAULT '',
    tags TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    due_date TEXT DEFAULT '',
    completed_at TEXT DEFAULT '',
    assignee TEXT DEFAULT '',
    executor TEXT DEFAULT '',
    progress INTEGER DEFAULT 0,
    result TEXT DEFAULT '',
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    ai_throught TEXT DEFAULT '',
    tags TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    status TEXT DEFAULT 'pending',
    closed_loop TEXT DEFAULT '',
    closed_at TEXT DEFAULT ''
  );
`);

export default db;