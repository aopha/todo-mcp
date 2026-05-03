# todo-mcp

基于 Model Context Protocol (MCP) 的任务管理 MCP 服务器。

## 功能

- **任务管理**：创建、查询、更新、删除任务
- **目标管理**：创建、查询、更新、删除目标（Goal）
- **任务关联目标**：支持将任务关联到特定目标

## 技术栈

- TypeScript
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)
- SQLite (better-sqlite3)

## 项目结构

```
todo-mcp/
├── src/
│   ├── index.ts          # MCP 服务器入口
│   ├── db/               # 数据库层
│   │   ├── index.ts
│   │   ├── task.ts       # 任务 CRUD
│   │   └── goal.ts       # 目标 CRUD
│   ├── handlers/         # MCP 工具处理器
│   │   ├── task.ts       # 任务相关工具
│   │   └── goal.ts       # 目标相关工具
│   └── types/            # TypeScript 类型定义
│       └── index.ts
├── dist/                 # 编译输出
├── docs/                 # 文档
└── todo.db               # SQLite 数据库文件
```

## 安装

### 方式一：全局安装

```bash
npm install
npm run build
npm install -g .
```

### 方式二：使用 npm link

```bash
npm install
npm run build
npm link
```

## 使用

### 配置 Claude Code

在项目的 `.mcp.json` 中添加：

```json
{
  "mcpServers": {
    "todo-mcp": {
      "command": "todo-mcp"
    }
  }
}
```

### 重启 MCP 连接

```
/mcp
```

### 可用工具

#### 任务操作

| 工具名 | 功能 |
|--------|------|
| `create_task` | 创建任务 |
| `get_task` | 获取任务详情 |
| `list_tasks` | 列出任务 |
| `update_task` | 更新任务 |
| `delete_task` | 删除任务 |

#### 目标操作

| 工具名 | 功能 |
|--------|------|
| `create_goal` | 创建目标 |
| `get_goal` | 获取目标详情 |
| `list_goals` | 列出目标 |
| `update_goal` | 更新目标 |
| `delete_goal` | 删除目标 |

### 任务字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | string | 任务标题（必填） |
| `description` | string | 任务描述 |
| `status` | "pending" \| "doing" \| "done" | 状态 |
| `priority` | "high" \| "medium" \| "low" | 优先级 |
| `goal_id` | number \| null | 关联的目标 ID |
| `due_date` | string | 截止日期 |
| `assignee` | string | 负责人 |
| `executor` | string | 执行人 |
| `tags` | string | 标签 |
| `progress` | number | 进度 (0-100) |
| `result` | string | 结果 |
| `ai_suggestion` | string | AI 建议 |
| `created_at` | string | 创建时间 |
| `completed_at` | string | 完成时间 |

### 目标字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | string | 目标标题（必填） |
| `description` | string | 目标描述 |
| `period` | string | 周期 |
| `criteria` | string | 完成标准 |
| `weight` | number | 权重 |
| `ai_suggestion` | string | AI 建议 |

## 开发

```bash
# 构建
npm run build

# 监听模式（开发用）
npm run watch
```

## 数据库

数据存储在 `todo.db` (SQLite)。如需重置：

```bash
rm todo.db
# 下次启动时会自动创建新数据库
```

## License

MIT License

Copyright (c) 2026 aopha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
