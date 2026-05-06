import db from './index.js';
import type { Record } from '../types/index.js';

export function createRecord(record: Omit<Record, 'id' | 'created_at'>): Record {
  const stmt = db.prepare(`
    INSERT INTO records (title, content, ai_throught, tags, status, closed_loop, closed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    record.title,
    record.content || '',
    record.ai_throught || '',
    record.tags || '',
    record.status || 'pending',
    record.closed_loop || '',
    record.closed_at || ''
  );
  return { ...record, id: result.lastInsertRowid as number, created_at: new Date().toISOString() };
}

export function getRecord(id: number): Record | undefined {
  const stmt = db.prepare('SELECT * FROM records WHERE id = ?');
  return stmt.get(id) as Record | undefined;
}

export function listRecords(status?: string): Record[] {
  let sql = 'SELECT * FROM records WHERE 1=1';
  const params: string[] = [];
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  sql += ' ORDER BY created_at DESC';
  const stmt = db.prepare(sql);
  return stmt.all(...params) as Record[];
}

export function updateRecord(id: number, fields: Partial<Record>): Record | undefined {
  const allowed = ['title', 'content', 'ai_throught', 'tags', 'status', 'closed_loop', 'closed_at'];
  const updates = Object.keys(fields).filter(k => allowed.includes(k) && k !== 'id');
  if (updates.length === 0) return getRecord(id);
  const sql = `UPDATE records SET ${updates.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;
  const stmt = db.prepare(sql);
  stmt.run(...updates.map(k => fields[k as keyof Record]), id);
  return getRecord(id);
}

export function deleteRecord(id: number): boolean {
  const stmt = db.prepare('DELETE FROM records WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}
