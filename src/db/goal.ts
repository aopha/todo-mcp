import db from './index.js';
import type { Goal } from '../types/index.js';

export function createGoal(goal: Omit<Goal, 'id' | 'created_at'>): Goal {
  const stmt = db.prepare(`
    INSERT INTO goals (title, description, period, criteria, weight, ai_suggestion, result, self_evaluation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    goal.title,
    goal.description || '',
    goal.period || '',
    goal.criteria || '',
    goal.weight || 0,
    goal.ai_suggestion || '',
    goal.result || '',
    goal.self_evaluation || ''
  );
  return { ...goal, id: result.lastInsertRowid as number, created_at: new Date().toISOString() };
}

export function getGoal(id: number): Goal | undefined {
  const stmt = db.prepare('SELECT * FROM goals WHERE id = ?');
  return stmt.get(id) as Goal | undefined;
}

export function listGoals(): Goal[] {
  const stmt = db.prepare('SELECT * FROM goals ORDER BY id DESC');
  return stmt.all() as Goal[];
}

export function updateGoal(id: number, fields: Partial<Goal>): Goal | undefined {
  const allowed = ['title', 'description', 'period', 'criteria', 'weight', 'ai_suggestion', 'result', 'self_evaluation'];
  const updates = Object.keys(fields).filter(k => allowed.includes(k) && k !== 'id');
  if (updates.length === 0) return getGoal(id);
  const sql = `UPDATE goals SET ${updates.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;
  const stmt = db.prepare(sql);
  stmt.run(...updates.map(k => fields[k as keyof Goal]), id);
  return getGoal(id);
}

export function deleteGoal(id: number): boolean {
  const stmt = db.prepare('DELETE FROM goals WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}