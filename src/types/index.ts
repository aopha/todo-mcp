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
  completed_at: string;
  due_date: string;
  assignee: string;
  executor: string;
  progress: number;
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
  created_at: string;
  result: string;
  self_evaluation: string;
}

export interface Insight {
  id?: number;
  title: string;
  description: string;
  ai_suggestion: string;
  tags: string;
  created_at: string;
  status: 'pending' | 'done' | 'doing';
  closed_loop: string;
  closed_at: string;
}