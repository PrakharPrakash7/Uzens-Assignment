import type { KanbanColumn, KanbanTask } from '@/components/KanbanBoard/KanbanBoard.types';

export const sampleColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: [], maxTasks: 10 },
  { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: [], maxTasks: 5 },
  { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [], maxTasks: 3 },
  { id: 'done', title: 'Done', color: '#10b981', taskIds: [] },
];

export const sampleTasks: Record<string, KanbanTask> = {
  'task-1': {
    id: 'task-1',
    title: 'Implement drag and drop',
    description: 'Add D&D functionality to kanban cards using native HTML5 drag and drop API',
    status: 'todo',
    priority: 'high',
    assignee: 'John Doe',
    tags: ['frontend', 'feature'],
    createdAt: new Date(2024, 0, 10),
    dueDate: new Date(2024, 0, 20),
  },
  'task-2': {
    id: 'task-2',
    title: 'Design task modal',
    description: 'Create modal for editing task details with proper form validation',
    status: 'todo',
    priority: 'medium',
    assignee: 'Jane Smith',
    tags: ['design', 'ui'],
    createdAt: new Date(2024, 0, 11),
    dueDate: new Date(2024, 0, 18),
  },
  'task-3': {
    id: 'task-3',
    title: 'Setup TypeScript',
    description: 'Configure TypeScript with strict mode enabled',
    status: 'in-progress',
    priority: 'urgent',
    assignee: 'John Doe',
    tags: ['setup', 'typescript'],
    createdAt: new Date(2024, 0, 9),
  },
  'task-4': {
    id: 'task-4',
    title: 'Create project structure',
    description: 'Setup folder structure and initial files according to requirements',
    status: 'done',
    priority: 'low',
    assignee: 'Jane Smith',
    tags: ['setup'],
    createdAt: new Date(2024, 0, 8),
    dueDate: new Date(2024, 0, 9),
  },
  'task-5': {
    id: 'task-5',
    title: 'Install dependencies',
    status: 'done',
    priority: 'low',
    assignee: 'John Doe',
    tags: ['setup'],
    createdAt: new Date(2024, 0, 8),
  },
};

export const generateMockTasks = (count: number): { columns: KanbanColumn[]; tasks: Record<string, KanbanTask> } => {
  const columns: KanbanColumn[] = [
    { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: [], maxTasks: 10 },
    { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: [], maxTasks: 5 },
    { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [], maxTasks: 3 },
    { id: 'done', title: 'Done', color: '#10b981', taskIds: [] },
  ];

  const tasks: Record<string, KanbanTask> = {};
  const priorities: Array<'low' | 'medium' | 'high' | 'urgent'> = ['low', 'medium', 'high', 'urgent'];
  const statuses = ['todo', 'in-progress', 'review', 'done'];
  const assignees = ['Alice Johnson', 'Bob Smith', 'Carol White', 'David Brown', 'Eve Davis'];
  const tagOptions = ['frontend', 'backend', 'design', 'feature', 'bug', 'urgent', 'refactor'];

  for (let i = 1; i <= count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const taskId = `task-${i}`;

    tasks[taskId] = {
      id: taskId,
      title: `Task ${i}: ${['Implement', 'Design', 'Fix', 'Update', 'Create'][Math.floor(Math.random() * 5)]} ${['feature', 'component', 'bug', 'layout', 'API'][Math.floor(Math.random() * 5)]}`,
      description: Math.random() > 0.5 ? `Detailed description for task ${i}` : undefined,
      status,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      assignee: Math.random() > 0.2 ? assignees[Math.floor(Math.random() * assignees.length)] : undefined,
      tags: Array.from({ length: Math.floor(Math.random() * 4) }, () => tagOptions[Math.floor(Math.random() * tagOptions.length)]),
      createdAt: new Date(2024, 0, Math.floor(Math.random() * 20) + 1),
      dueDate: Math.random() > 0.4 ? new Date(2024, 0, Math.floor(Math.random() * 30) + 15) : undefined,
    };

    const column = columns.find(col => col.id === status);
    if (column) {
      column.taskIds.push(taskId);
    }
  }

  return { columns, tasks };
};

export const getInitialColumns = (): KanbanColumn[] => {
  return [
    { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: ['task-1', 'task-2'], maxTasks: 10 },
    { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: ['task-3'], maxTasks: 5 },
    { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [], maxTasks: 3 },
    { id: 'done', title: 'Done', color: '#10b981', taskIds: ['task-4', 'task-5'] },
  ];
};
