import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '../../todo.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    period TEXT DEFAULT '',
    criteria TEXT DEFAULT '',
    weight REAL DEFAULT 0,
    ai_suggestion TEXT DEFAULT ''
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
    created_at TEXT DEFAULT (datetime('now')),
    due_date TEXT DEFAULT '',
    completed_at TEXT DEFAULT '',
    assignee TEXT DEFAULT '',
    executor TEXT DEFAULT '',
    progress INTEGER DEFAULT 0,
    result TEXT DEFAULT '',
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL
  );
`);

// Migration: add columns only if they don't exist
const taskColumns = db.prepare('PRAGMA table_info(tasks)').all() as { name: string }[];
const columnNames = taskColumns.map(c => c.name);

const addColumnIfNotExists = (name: string, type: string, defaultVal: string) => {
  if (!columnNames.includes(name)) {
    db.exec(`ALTER TABLE tasks ADD COLUMN ${name} ${type} DEFAULT '${defaultVal}'`);
  }
};

addColumnIfNotExists('executor', 'TEXT', '');
addColumnIfNotExists('progress', 'INTEGER', '0');
addColumnIfNotExists('completed_at', 'TEXT', '');

export default db;