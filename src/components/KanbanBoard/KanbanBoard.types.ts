/**
 * Task priority levels
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Kanban task interface
 */
export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: string; // column identifier
  priority?: TaskPriority;
  assignee?: string;
  tags?: string[];
  createdAt: Date;
  dueDate?: Date;
}

/**
 * Kanban column interface
 */
export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  taskIds: string[]; // ordered list of task IDs
  maxTasks?: number; // WIP limit (optional)
}

/**
 * Kanban board data structure
 */
export interface KanbanBoardData {
  columns: KanbanColumn[];
  tasks: Record<string, KanbanTask>;
}

/**
 * Kanban board props
 */
export interface KanbanBoardProps {
  columns: KanbanColumn[];
  tasks: Record<string, KanbanTask>;
  onTaskMove: (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => void;
  onTaskCreate: (columnId: string, task: Omit<KanbanTask, 'id' | 'createdAt'>) => void;
  onTaskUpdate: (taskId: string, updates: Partial<KanbanTask>) => void;
  onTaskDelete: (taskId: string) => void;
}

/**
 * Drag state interface
 */
export interface DragState {
  isDragging: boolean;
  draggedId: string | null;
  draggedFromColumn: string | null;
  dropTargetColumn: string | null;
  dragOverIndex: number | null;
}

/**
 * Task form data (for modal)
 */
export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  assignee: string;
  tags: string[];
  dueDate: Date | null;
}

/**
 * Form validation errors
 */
export type FormErrors = Partial<Record<keyof TaskFormData, string>>;
