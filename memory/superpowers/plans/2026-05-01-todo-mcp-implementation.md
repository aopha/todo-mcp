# Todo MCP Server 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现一个 MCP Server，提供 Task 和 Goal 的增删改查接口，数据存储在 SQLite，通过 stdio 传输层通信。

**Architecture:** 使用 @modelcontextprotocol/sdk 的 Node.js stdio server，数据层用 better-sqlite3，按层划分项目结构（types/db/handlers）。

**Tech Stack:** Node.js, TypeScript, @modelcontextprotocol/sdk, better-sqlite3

---

## 文件结构

```
package.json          # 项目配置，bin 指向 dist/index.js
tsconfig.json         # TypeScript 配置
src/
├── index.ts          # 入口，启动 MCP server
├── types/
│   └── index.ts      # Task、Goal 类型定义
├── db/
│   ├── index.ts      # 数据库初始化和迁移
│   ├── task.ts       # Task CRUD
│   └── goal.ts       # Goal CRUD
└── handlers/
    ├── task.ts       # Task MCP handlers
    └── goal.ts       # Goal MCP handlers
```

---

### Task 1: 初始化项目

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "todo-mcp",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "todo-mcp": "dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "prepublish": "npm run build"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "better-sqlite3": "^11.0.0"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.0",
    "@types/node": "^22.0.0",
    "typescript": "^5.0.0"
  }
}
```

- [ ] **Step 2: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: 安装依赖**

Run: `npm install`

- [ ] **Step 4: 提交**

```bash
git add package.json tsconfig.json package-lock.json
git commit -m "feat: initialize project with dependencies"
```

---

### Task 2: 定义类型

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: 创建 src/types/index.ts**

```typescript
export interface Task {
  id?: number;
  goal_id: number | null;
  title: string;
  description: string;
  ai_suggestion: string;
  tags: string;
  status: 'pending' | 'done' | 'doing';
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  due_date: string;
  assignee: '本人' | 'AI';
  progress: string;
  result: string;
}

export interface Goal {
  id?: number;
  title: string;
  description: string;
  period: string;
  criteria: string;
  weight: number;
  ai_suggestion: string;
}
```

- [ ] **Step 2: 提交**

```bash
git add src/types/index.ts
git commit -m "feat: add Task and Goal types"
```

---

### Task 3: 数据库层

**Files:**
- Create: `src/db/index.ts`
- Create: `src/db/task.ts`
- Create: `src/db/goal.ts`

- [ ] **Step 1: 创建 src/db/index.ts**

```typescript
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '../../todo.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    period TEXT DEFAULT '',
    criteria TEXT DEFAULT '',
    weight REAL DEFAULT 0,
    ai_suggestion TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_id INTEGER,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    ai_suggestion TEXT DEFAULT '',
    tags TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    created_at TEXT DEFAULT (datetime('now')),
    due_date TEXT DEFAULT '',
    assignee TEXT DEFAULT '本人',
    progress TEXT DEFAULT '',
    result TEXT DEFAULT '',
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL
  );
`);

export default db;
```

- [ ] **Step 2: 创建 src/db/task.ts**

```typescript
import db from './index.js';
import type { Task } from '../types/index.js';

export function createTask(task: Omit<Task, 'id' | 'created_at'>): Task {
  const stmt = db.prepare(`
    INSERT INTO tasks (goal_id, title, description, ai_suggestion, tags, status, priority, due_date, assignee, progress, result)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
  const allowed = ['goal_id', 'title', 'description', 'ai_suggestion', 'tags', 'status', 'priority', 'due_date', 'assignee', 'progress', 'result'];
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
```

- [ ] **Step 3: 创建 src/db/goal.ts**

```typescript
import db from './index.js';
import type { Goal } from '../types/index.js';

export function createGoal(goal: Omit<Goal, 'id'>): Goal {
  const stmt = db.prepare(`
    INSERT INTO goals (title, description, period, criteria, weight, ai_suggestion)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    goal.title,
    goal.description || '',
    goal.period || '',
    goal.criteria || '',
    goal.weight || 0,
    goal.ai_suggestion || ''
  );
  return { ...goal, id: result.lastInsertRowid as number };
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
  const allowed = ['title', 'description', 'period', 'criteria', 'weight', 'ai_suggestion'];
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
```

- [ ] **Step 4: 提交**

```bash
git add src/db/
git commit -m "feat: add database layer with Task and Goal CRUD"
```

---

### Task 4: Handlers 层

**Files:**
- Create: `src/handlers/task.ts`
- Create: `src/handlers/goal.ts`

- [ ] **Step 1: 创建 src/handlers/task.ts**

```typescript
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
```

- [ ] **Step 2: 创建 src/handlers/goal.ts**

```typescript
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
        ai_suggestion: { type: 'string' }
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
        ai_suggestion: { type: 'string' }
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
```

- [ ] **Step 3: 提交**

```bash
git add src/handlers/
git commit -m "feat: add MCP handlers for Task and Goal"
```

---

### Task 5: 主入口

**Files:**
- Create: `src/index.ts`

- [ ] **Step 1: 创建 src/index.ts**

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { taskHandlers } from './handlers/task.js';
import { goalHandlers } from './handlers/goal.js';

const server = new Server(
  { name: 'todo-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

const tools = { ...taskHandlers, ...goalHandlers };

server.setRequestHandler({ method: 'tools/list' }, async () => ({
  tools: Object.entries(tools).map(([name, { description, inputSchema }]) => ({
    name,
    description,
    inputSchema
  }))
}));

server.setRequestHandler({ method: 'tools/call' }, async (request: { params: { name: string; arguments?: Record<string, unknown> } }) => {
  const { name, arguments: args = {} } = request.params;
  const handler = tools[name];
  if (!handler) {
    throw new Error(`Unknown tool: ${name}`);
  }
  const result = await handler.handler(args);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

const transport = new StdioServerTransport();
server.connect(transport);
```

- [ ] **Step 2: 编译验证**

Run: `npm run build`
Expected: 编译成功，无错误

- [ ] **Step 3: 提交**

```bash
git add src/index.ts
git commit -m "feat: add MCP server entry point"
```

---

### Task 6: 验证运行

- [ ] **Step 1: 验证 npx 运行**

Run: `node dist/index.js` (手动测试 stdio 连接)
Expected: MCP server 启动，等待 stdio 输入

---

## 验收标准

1. 所有 CRUD 接口正常工作
2. list_tasks 支持按 goal_id 和 status 筛选
3. 数据持久化到 SQLite 文件
4. 通过 npx 即可启动

---

## 执行方式

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
