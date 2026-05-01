import { createTask, getTask, listTasks, updateTask, deleteTask } from '../db/task.js';
import type { Task } from '../types/index.js';

export const taskHandlers = {
  create_task: {
    description: 'Create a new task',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        goal_id: { type: 'number', nullable: true },
        description: { type: 'string' },
        ai_suggestion: { type: 'string' },
        tags: { type: 'string' },
        status: { type: 'string', enum: ['pending', 'done', 'doing'] },
        priority: { type: 'string', enum: ['high', 'medium', 'low'] },
        due_date: { type: 'string' },
        assignee: { type: 'string' },
        progress: { type: 'string' },
        result: { type: 'string' }
      },
      required: ['title']
    },
    handler: (args: Partial<Task>) => createTask(args as Omit<Task, 'id' | 'created_at'>)
  },

  get_task: {
    description: 'Get a task by ID',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number' } },
      required: ['id']
    },
    handler: (args: { id: number }) => getTask(args.id)
  },

  list_tasks: {
    description: 'List tasks with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        goal_id: { type: 'number' },
        status: { type: 'string', enum: ['pending', 'done', 'doing'] }
      }
    },
    handler: (args: { goal_id?: number; status?: string }) => listTasks(args.goal_id, args.status)
  },

  update_task: {
    description: 'Update a task',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        goal_id: { type: 'number', nullable: true },
        description: { type: 'string' },
        ai_suggestion: { type: 'string' },
        tags: { type: 'string' },
        status: { type: 'string', enum: ['pending', 'done', 'doing'] },
        priority: { type: 'string', enum: ['high', 'medium', 'low'] },
        due_date: { type: 'string' },
        assignee: { type: 'string' },
        progress: { type: 'string' },
        result: { type: 'string' }
      },
      required: ['id']
    },
    handler: (args: Partial<Task> & { id: number }) => {
      const { id, ...fields } = args;
      return updateTask(id, fields);
    }
  },

  delete_task: {
    description: 'Delete a task',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number' } },
      required: ['id']
    },
    handler: (args: { id: number }) => deleteTask(args.id)
  }
};