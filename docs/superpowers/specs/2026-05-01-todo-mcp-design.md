# Todo MCP Server 设计

## 概述

MCP Server 提供任务（Task）和全年目标（Goal）的增删改查接口，数据存储在 SQLite 中，通过 stdio 传输层与客户端通信。

## 技术栈

- Runtime: Node.js + TypeScript
- MCP SDK: @modelcontextprotocol/sdk
- Database: SQLite (better-sqlite3)
- Transport: stdio

## 项目结构

按层划分：

```
src/
├── index.ts           # 入口，启动 MCP server
├── types/
│   └── index.ts       # Task、Goal 类型定义
├── db/
│   ├── index.ts       # 数据库初始化
│   ├── task.ts        # Task CRUD
│   └── goal.ts        # Goal CRUD
└── handlers/
    ├── task.ts        # Task MCP handlers
    └── goal.ts        # Goal MCP handlers
```

## 数据模型

### Task

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| goal_id | INTEGER | 关联目标ID，可为空 |
| title | TEXT | 标题 |
| description | TEXT | 描述 |
| ai_suggestion | TEXT | AI处理建议 |
| tags | TEXT | 标签，逗号分隔 |
| status | TEXT | pending/done/doing |
| priority | TEXT | high/medium/low |
| created_at | TEXT | 创建时间 |
| due_date | TEXT | 截止时间 |
| assignee | TEXT | 本人/AI |
| progress | TEXT | 进展 |
| result | TEXT | 最终结果 |

### Goal

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| title | TEXT | 标题 |
| description | TEXT | 描述 |
| period | TEXT | 目标周期 |
| criteria | TEXT | 评价标准 |
| weight | REAL | 权重占比 |
| ai_suggestion | TEXT | AI处理建议 |

## MCP Tools

### Task

| Tool | 说明 | 参数 |
|------|------|------|
| create_task | 创建任务 | title, description?, goal_id?, ai_suggestion?, tags?, status?, priority?, due_date?, assignee?, progress?, result? |
| get_task | 获取单个任务 | id |
| list_tasks | 列出任务 | goal_id?, status? |
| update_task | 更新任务 | id, ...fields |
| delete_task | 删除任务 | id |

### Goal

| Tool | 说明 | 参数 |
|------|------|------|
| create_goal | 创建目标 | title, description?, period?, criteria?, weight?, ai_suggestion? |
| get_goal | 获取单个目标 | id |
| list_goals | 列出目标 | - |
| update_goal | 更新目标 | id, ...fields |
| delete_goal | 删除目标 | id |

## 运行方式

```bash
npx
```

## 验收标准

1. 所有 CRUD 接口正常工作
2. list_tasks 支持按 goal_id 和 status 筛选
3. 数据持久化到 SQLite 文件
4. 通过 npx 即可启动
