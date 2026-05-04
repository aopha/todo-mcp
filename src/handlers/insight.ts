import { createInsight, getInsight, listInsights, updateInsight, deleteInsight } from '../db/insight.js';
import type { Insight } from '../types/index.js';

export const insightHandlers = {
  create_insight: {
    description: 'Create a new insight',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        ai_suggestion: { type: 'string' },
        tags: { type: 'string' },
        status: { type: 'string', enum: ['pending', 'done', 'doing'] },
        closed_loop: { type: 'string' },
        closed_at: { type: 'string' }
      },
      required: ['title']
    },
    handler: (args: Partial<Insight>) => createInsight(args as Omit<Insight, 'id' | 'created_at'>)
  },

  get_insight: {
    description: 'Get an insight by ID',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number' } },
      required: ['id']
    },
    handler: (args: { id: number }) => getInsight(args.id)
  },

  list_insights: {
    description: 'List insights with optional status filter',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['pending', 'done', 'doing'] }
      }
    },
    handler: (args: { status?: string }) => listInsights(args.status)
  },

  update_insight: {
    description: 'Update an insight',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        description: { type: 'string' },
        ai_suggestion: { type: 'string' },
        tags: { type: 'string' },
        status: { type: 'string', enum: ['pending', 'done', 'doing'] },
        closed_loop: { type: 'string' },
        closed_at: { type: 'string' }
      },
      required: ['id']
    },
    handler: (args: Partial<Insight> & { id: number }) => {
      const { id, ...fields } = args;
      return updateInsight(id, fields);
    }
  },

  delete_insight: {
    description: 'Delete an insight',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number' } },
      required: ['id']
    },
    handler: (args: { id: number }) => deleteInsight(args.id)
  }
};
