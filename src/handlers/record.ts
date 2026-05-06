import { createRecord, getRecord, listRecords, updateRecord, deleteRecord } from '../db/record.js';
import type { Record } from '../types/index.js';

export const recordHandlers = {
  create_record: {
    description: 'Create a new record',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        ai_throught: { type: 'string' },
        tags: { type: 'string' },
        status: { type: 'string', enum: ['pending', 'done', 'doing'] },
        closed_loop: { type: 'string' },
        closed_at: { type: 'string' }
      },
      required: ['title']
    },
    handler: (args: Partial<Record>) => createRecord(args as Omit<Record, 'id' | 'created_at'>)
  },

  get_record: {
    description: 'Get a record by ID',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number' } },
      required: ['id']
    },
    handler: (args: { id: number }) => getRecord(args.id)
  },

  list_records: {
    description: 'List records with optional status filter',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['pending', 'done', 'doing'] }
      }
    },
    handler: (args: { status?: string }) => listRecords(args.status)
  },

  update_record: {
    description: 'Update a record',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        content: { type: 'string' },
        ai_throught: { type: 'string' },
        tags: { type: 'string' },
        status: { type: 'string', enum: ['pending', 'done', 'doing'] },
        closed_loop: { type: 'string' },
        closed_at: { type: 'string' }
      },
      required: ['id']
    },
    handler: (args: Partial<Record> & { id: number }) => {
      const { id, ...fields } = args;
      return updateRecord(id, fields);
    }
  },

  delete_record: {
    description: 'Delete a record',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number' } },
      required: ['id']
    },
    handler: (args: { id: number }) => deleteRecord(args.id)
  }
};
