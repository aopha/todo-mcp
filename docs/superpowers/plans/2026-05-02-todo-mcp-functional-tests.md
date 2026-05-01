# Todo-MCP Functional Test Plan

> **For agentic workers:** This plan contains executable test cases for ClaudeCode to run via natural language.

**Goal:** Verify all CRUD operations for Task and Goal entities in todo-mcp MCP tools

**Architecture:** Test each tool independently, then verify relationships between Task and Goal

**Tech Stack:** ClaudeCode MCP tools (todo-mcp)

---

## Test Summary

| # | Test Case | Tools Used | Expected Result |
|---|-----------|------------|----------------|
| 1 | Create a goal | create_goal | Goal created with ID |
| 2 | Create a task without goal | create_task | Task created with ID |
| 3 | Create a task linked to goal | create_task (with goal_id) | Task created and linked |
| 4 | List all goals | list_goals | Returns array including new goal |
| 5 | List all tasks | list_tasks | Returns array including new tasks |
| 6 | List tasks filtered by goal | list_tasks (goal_id) | Returns only tasks for that goal |
| 7 | Get goal by ID | get_goal | Returns goal data |
| 8 | Get task by ID | get_task | Returns task data |
| 9 | Update goal | update_goal | Goal updated |
| 10 | Update task | update_task | Task updated |
| 11 | Delete task | delete_task | Task deleted |
| 12 | Delete goal | delete_goal | Goal deleted |

---

## Prerequisites

Before running tests, ensure the todo-mcp MCP server is running and accessible.

---

## Test Cases

### Test 1: Create a Goal

**Purpose:** Verify goal creation returns a valid goal object with an ID

**Steps:**

- [ ] **Step 1: Create a new goal**

自然语言执行：
```
使用 create_goal 工具创建一个新目标：
- title: "Q2 技术目标"
- description: "完成技术架构升级"
- period: "2026-Q2"
- criteria: "架构文档+代码实现"
- weight: 80
```

**Expected Output:**
```json
{
  "id": <number>,
  "title": "Q2 技术目标",
  "description": "完成技术架构升级",
  "period": "2026-Q2",
  "criteria": "架构文档+代码实现",
  "weight": 80,
  "ai_suggestion": null
}
```

**验证点：**
- [ ] `id` 字段存在且为数字
- [ ] `title` 正确返回
- [ ] `period` 正确返回
- [ ] `weight` 正确返回

**保存测试数据：**
```
GOAL_ID_1 = <上面返回的id值>
```

---

### Test 2: Create a Task (Without Goal Link)

**Purpose:** Verify task creation without linking to any goal

**Steps:**

- [ ] **Step 1: Create a new task**

自然语言执行：
```
使用 create_task 工具创建一个新任务：
- title: "编写技术文档"
- description: "编写新架构的技术设计文档"
- status: "pending"
- priority: "high"
- due_date: "2026-05-15"
- tags: "文档,架构"
```

**Expected Output:**
```json
{
  "id": <number>,
  "title": "编写技术文档",
  "description": "编写新架构的技术设计文档",
  "status": "pending",
  "priority": "high",
  "due_date": "2026-05-15",
  "tags": "文档,架构",
  "goal_id": null,
  "assignee": null,
  "progress": null,
  "result": null,
  "ai_suggestion": null
}
```

**验证点：**
- [ ] `id` 字段存在且为数字
- [ ] `title` 正确返回
- [ ] `status` 为 "pending"
- [ ] `priority` 为 "high"
- [ ] `goal_id` 为 null

**保存测试数据：**
```
TASK_ID_1 = <上面返回的id值>
```

---

### Test 3: Create a Task (Linked to Goal)

**Purpose:** Verify task can be created and linked to a goal

**Steps:**

- [ ] **Step 1: Create a task linked to the goal from Test 1**

自然语言执行：
```
使用 create_task 工具创建一个新任务并关联到目标：
- title: "重构用户模块"
- description: "按新架构重构用户模块代码"
- status: "doing"
- priority: "medium"
- goal_id: {GOAL_ID_1}
- tags: "重构,用户模块"
```

**Expected Output:**
```json
{
  "id": <number>,
  "title": "重构用户模块",
  "description": "按新架构重构用户模块代码",
  "status": "doing",
  "priority": "medium",
  "goal_id": {GOAL_ID_1},
  "tags": "重构,用户模块"
}
```

**验证点：**
- [ ] `id` 字段存在且为数字
- [ ] `goal_id` 等于 {GOAL_ID_1}
- [ ] `status` 为 "doing"

**保存测试数据：**
```
TASK_ID_2 = <上面返回的id值>
```

---

### Test 4: List All Goals

**Purpose:** Verify list_goals returns all created goals including the new one

**Steps:**

- [ ] **Step 1: List all goals**

自然语言执行：
```
使用 list_goals 工具获取所有目标列表
```

**Expected Output:**
```json
{
  "goals": [
    {
      "id": {GOAL_ID_1},
      "title": "Q2 技术目标",
      ...
    }
  ]
}
```

**验证点：**
- [ ] 返回的 goals 是数组
- [ ] 包含刚才创建的 GOAL_ID_1

---

### Test 5: List All Tasks

**Purpose:** Verify list_tasks returns all created tasks

**Steps:**

- [ ] **Step 1: List all tasks**

自然语言执行：
```
使用 list_tasks 工具获取所有任务列表
```

**Expected Output:**
```json
{
  "tasks": [
    {
      "id": {TASK_ID_1},
      "title": "编写技术文档",
      ...
    },
    {
      "id": {TASK_ID_2},
      "title": "重构用户模块",
      ...
    }
  ]
}
```

**验证点：**
- [ ] 返回的 tasks 是数组
- [ ] 包含 TASK_ID_1 和 TASK_ID_2

---

### Test 6: List Tasks Filtered by Goal

**Purpose:** Verify list_tasks with goal_id filter returns only tasks for that goal

**Steps:**

- [ ] **Step 1: List tasks filtered by goal_id**

自然语言执行：
```
使用 list_tasks 工具，传入 goal_id 参数：{GOAL_ID_1}
```

**Expected Output:**
```json
{
  "tasks": [
    {
      "id": {TASK_ID_2},
      "goal_id": {GOAL_ID_1},
      "title": "重构用户模块"
    }
  ]
}
```

**验证点：**
- [ ] 只返回 1 个任务
- [ ] 该任务的 goal_id 为 {GOAL_ID_1}
- [ ] 不包含 TASK_ID_1（它没有关联目标）

---

### Test 7: Get Goal by ID

**Purpose:** Verify get_goal returns the correct goal data

**Steps:**

- [ ] **Step 1: Get goal by ID**

自然语言执行：
```
使用 get_goal 工具，传入 id：{GOAL_ID_1}
```

**Expected Output:**
```json
{
  "id": {GOAL_ID_1},
  "title": "Q2 技术目标",
  "description": "完成技术架构升级",
  "period": "2026-Q2",
  "criteria": "架构文档+代码实现",
  "weight": 80
}
```

**验证点：**
- [ ] 所有字段与创建时一致

---

### Test 8: Get Task by ID

**Purpose:** Verify get_task returns the correct task data

**Steps:**

- [ ] **Step 1: Get task by ID**

自然语言执行：
```
使用 get_task 工具，传入 id：{TASK_ID_1}
```

**Expected Output:**
```json
{
  "id": {TASK_ID_1},
  "title": "编写技术文档",
  "status": "pending",
  "priority": "high"
}
```

**验证点：**
- [ ] 所有字段与创建时一致

---

### Test 9: Update Goal

**Purpose:** Verify goal fields can be updated

**Steps:**

- [ ] **Step 1: Update goal**

自然语言执行：
```
使用 update_goal 工具更新目标 {GOAL_ID_1}：
- title: "Q2 技术目标 - 已更新"
- weight: 90
- criteria: "架构文档+代码实现+测试"
```

**Expected Output:**
```json
{
  "id": {GOAL_ID_1},
  "title": "Q2 技术目标 - 已更新",
  "weight": 90,
  "criteria": "架构文档+代码实现+测试"
}
```

**验证点：**
- [ ] title 已更新
- [ ] weight 已更新
- [ ] criteria 已更新
- [ ] 其他字段保持不变

---

### Test 10: Update Task

**Purpose:** Verify task fields can be updated

**Steps:**

- [ ] **Step 1: Update task status and progress**

自然语言执行：
```
使用 update_task 工具更新任务 {TASK_ID_1}：
- status: "done"
- progress: "100"
- result: "文档已完成并评审通过"
```

**Expected Output:**
```json
{
  "id": {TASK_ID_1},
  "status": "done",
  "progress": "100",
  "result": "文档已完成并评审通过"
}
```

**验证点：**
- [ ] status 更新为 "done"
- [ ] progress 更新为 "100"
- [ ] result 已设置

---

### Test 11: Delete Task

**Purpose:** Verify task can be deleted

**Steps:**

- [ ] **Step 1: Delete task**

自然语言执行：
```
使用 delete_task 工具删除任务 {TASK_ID_1}
```

**Expected Output:**
```json
{
  "success": true
}
```

**验证点：**
- [ ] 返回 success: true
- [ ] 使用 get_task({TASK_ID_1}) 验证返回错误或null

---

### Test 12: Delete Goal

**Purpose:** Verify goal can be deleted (should not affect linked tasks)

**Steps:**

- [ ] **Step 1: Delete goal**

自然语言执行：
```
使用 delete_goal 工具删除目标 {GOAL_ID_1}
```

**Expected Output:**
```json
{
  "success": true
}
```

**验证点：**
- [ ] 返回 success: true
- [ ] 使用 get_goal({GOAL_ID_1}) 验证返回错误或null

---

## Test Results Summary

| Test # | Test Case | Status | Actual Output | Notes |
|--------|-----------|--------|---------------|-------|
| 1 | Create Goal | ⬜ | | |
| 2 | Create Task (no goal) | ⬜ | | |
| 3 | Create Task (with goal) | ⬜ | | |
| 4 | List Goals | ⬜ | | |
| 5 | List Tasks | ⬜ | | |
| 6 | List Tasks by Goal | ⬜ | | |
| 7 | Get Goal | ⬜ | | |
| 8 | Get Task | ⬜ | | |
| 9 | Update Goal | ⬜ | | |
| 10 | Update Task | ⬜ | | |
| 11 | Delete Task | ⬜ | | |
| 12 | Delete Goal | ⬜ | | |

**Test Summary:**
- **Total:** 12
- **Passed:** ___
- **Failed:** ___
- **Notes:** ________________________________________________________________

---

## Execution Instructions

1. 按顺序执行每个测试用例
2. 每个测试后记录实际输出到上表的"Actual Output"列
3. 在"Status"列标记 ✅ (通过) 或 ❌ (失败)
4. 如有失败，在"Notes"列记录错误信息
5. 最后汇总结果到"Test Results Summary"部分
