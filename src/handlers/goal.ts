import { createGoal, getGoal, listGoals, updateGoal, deleteGoal } from '../db/goal.js';
import type { Goal } from '../types/index.js';

export const goalHandlers = {
  create_goal: {
    description: 'Create a new goal',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        period: { type: 'string' },
        criteria: { type: 'string' },
        weight: { type: 'number' },
        ai_suggestion: { type: 'string' },
        result: { type: 'string' },
        self_evaluation: { type: 'string' }
      },
      required: ['title']
    },
    handler: (args: Omit<Goal, 'id'>) => createGoal(args)
  },

  get_goal: {
    description: 'Get a goal by ID',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number' } },
      required: ['id']
    },
    handler: (args: { id: number }) => getGoal(args.id)
  },

  list_goals: {
    description: 'List all goals',
    inputSchema: { type: 'object', properties: {} },
    handler: () => listGoals()
  },

  update_goal: {
    description: 'Update a goal',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        description: { type: 'string' },
        period: { type: 'string' },
        criteria: { type: 'string' },
        weight: { type: 'number' },
        ai_suggestion: { type: 'string' },
        result: { type: 'string' },
        self_evaluation: { type: 'string' }
      },
      required: ['id']
    },
    handler: (args: Partial<Goal> & { id: number }) => {
      const { id, ...fields } = args;
      return updateGoal(id, fields);
    }
  },

  delete_goal: {
    description: 'Delete a goal',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number' } },
      required: ['id']
    },
    handler: (args: { id: number }) => deleteGoal(args.id)
  }
};