import db from './index.js';
import type { Insight } from '../types/index.js';

export function createInsight(insight: Omit<Insight, 'id' | 'created_at'>): Insight {
  const stmt = db.prepare(`
    INSERT INTO insights (title, description, ai_suggestion, tags, status, closed_loop, closed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    insight.title,
    insight.description || '',
    insight.ai_suggestion || '',
    insight.tags || '',
    insight.status || 'pending',
    insight.closed_loop || '',
    insight.closed_at || ''
  );
  return { ...insight, id: result.lastInsertRowid as number, created_at: new Date().toISOString() };
}

export function getInsight(id: number): Insight | undefined {
  const stmt = db.prepare('SELECT * FROM insights WHERE id = ?');
  return stmt.get(id) as Insight | undefined;
}

export function listInsights(status?: string): Insight[] {
  let sql = 'SELECT * FROM insights WHERE 1=1';
  const params: string[] = [];
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  sql += ' ORDER BY created_at DESC';
  const stmt = db.prepare(sql);
  return stmt.all(...params) as Insight[];
}

export function updateInsight(id: number, fields: Partial<Insight>): Insight | undefined {
  const allowed = ['title', 'description', 'ai_suggestion', 'tags', 'status', 'closed_loop', 'closed_at'];
  const updates = Object.keys(fields).filter(k => allowed.includes(k) && k !== 'id');
  if (updates.length === 0) return getInsight(id);
  const sql = `UPDATE insights SET ${updates.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;
  const stmt = db.prepare(sql);
  stmt.run(...updates.map(k => fields[k as keyof Insight]), id);
  return getInsight(id);
}

export function deleteInsight(id: number): boolean {
  const stmt = db.prepare('DELETE FROM insights WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}
