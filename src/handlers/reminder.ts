import { createReminder, getReminder, listReminders, updateReminder, deleteReminder } from '../db/reminder.js';
import type { Reminder } from '../types/index.js';

export const reminderHandlers = {
  create_reminder: {
    description: 'Create a new reminder',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        ai_suggestion: { type: 'string' },
        remind_at: { type: 'string' },
        status: { type: 'string', enum: ['pending', 'done'] },
        tags: { type: 'string' }
      },
      required: ['title']
    },
    handler: (args: Partial<Reminder>) => createReminder(args as Omit<Reminder, 'id' | 'created_at'>)
  },

  get_reminder: {
    description: 'Get a reminder by ID',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number' } },
      required: ['id']
    },
    handler: (args: { id: number }) => getReminder(args.id)
  },

  list_reminders: {
    description: 'List reminders with optional status filter',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['pending', 'done'] }
      }
    },
    handler: (args: { status?: string }) => listReminders(args.status)
  },

  update_reminder: {
    description: 'Update a reminder',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        content: { type: 'string' },
        ai_suggestion: { type: 'string' },
        remind_at: { type: 'string' },
        status: { type: 'string', enum: ['pending', 'done'] },
        tags: { type: 'string' }
      },
      required: ['id']
    },
    handler: (args: Partial<Reminder> & { id: number }) => {
      const { id, ...fields } = args;
      return updateReminder(id, fields);
    }
  },

  delete_reminder: {
    description: 'Delete a reminder',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number' } },
      required: ['id']
    },
    handler: (args: { id: number }) => deleteReminder(args.id)
  }
};
