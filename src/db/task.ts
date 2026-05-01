import db from './index.js';
import type { Task } from '../types/index.js';

export function createTask(task: Omit<Task, 'id' | 'created_at'>): Task {
  const stmt = db.prepare(`
    INSERT INTO tasks (goal_id, title, description, ai_suggestion, tags, status, priority, due_date, completed_at, assignee, progress, result)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    task.goal_id,
    task.title,
    task.description || '',
    task.ai_suggestion || '',
    task.tags || '',
    task.status || 'pending',
    task.priority || 'medium',
    task.due_date || '',
    task.completed_at || '',
    task.assignee || '本人',
    task.progress || '',
    task.result || ''
  );
  return { ...task, id: result.lastInsertRowid as number, created_at: new Date().toISOString() };
}

export function getTask(id: number): Task | undefined {
  const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
  return stmt.get(id) as Task | undefined;
}

export function listTasks(goalId?: number, status?: string): Task[] {
  let sql = 'SELECT * FROM tasks WHERE 1=1';
  const params: (number | string)[] = [];
  if (goalId !== undefined) {
    sql += ' AND goal_id = ?';
    params.push(goalId);
  }
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  sql += ' ORDER BY created_at DESC';
  const stmt = db.prepare(sql);
  return stmt.all(...params) as Task[];
}

export function updateTask(id: number, fields: Partial<Task>): Task | undefined {
  const allowed = ['goal_id', 'title', 'description', 'ai_suggestion', 'tags', 'status', 'priority', 'due_date', 'completed_at', 'assignee', 'progress', 'result'];
  const updates = Object.keys(fields).filter(k => allowed.includes(k) && k !== 'id');
  if (updates.length === 0) return getTask(id);
  const sql = `UPDATE tasks SET ${updates.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;
  const stmt = db.prepare(sql);
  stmt.run(...updates.map(k => fields[k as keyof Task]), id);
  return getTask(id);
}

export function deleteTask(id: number): boolean {
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}