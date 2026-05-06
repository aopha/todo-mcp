import db from './index.js';
import type { Reminder } from '../types/index.js';

export function createReminder(reminder: Omit<Reminder, 'id' | 'created_at'>): Reminder {
  const stmt = db.prepare(`
    INSERT INTO reminders (title, content, ai_suggestion, remind_at, status, tags)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    reminder.title,
    reminder.content || '',
    reminder.ai_suggestion || '',
    reminder.remind_at || '',
    reminder.status || 'pending',
    reminder.tags || ''
  );
  return { ...reminder, id: result.lastInsertRowid as number, created_at: new Date().toISOString() };
}

export function getReminder(id: number): Reminder | undefined {
  const stmt = db.prepare('SELECT * FROM reminders WHERE id = ?');
  return stmt.get(id) as Reminder | undefined;
}

export function listReminders(status?: string): Reminder[] {
  let sql = 'SELECT * FROM reminders WHERE 1=1';
  const params: string[] = [];
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  sql += ' ORDER BY created_at DESC';
  const stmt = db.prepare(sql);
  return stmt.all(...params) as Reminder[];
}

export function updateReminder(id: number, fields: Partial<Reminder>): Reminder | undefined {
  const allowed = ['title', 'content', 'ai_suggestion', 'remind_at', 'status', 'tags'];
  const updates = Object.keys(fields).filter(k => allowed.includes(k) && k !== 'id');
  if (updates.length === 0) return getReminder(id);
  const sql = `UPDATE reminders SET ${updates.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;
  const stmt = db.prepare(sql);
  stmt.run(...updates.map(k => fields[k as keyof Reminder]), id);
  return getReminder(id);
}

export function deleteReminder(id: number): boolean {
  const stmt = db.prepare('DELETE FROM reminders WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}
