import type { KanbanColumn } from '@/components/KanbanBoard/KanbanBoard.types';

/**
 * Gets column by ID
 */
export const getColumnById = (columns: KanbanColumn[], columnId: string): KanbanColumn | undefined => {
  return columns.find(col => col.id === columnId);
};

/**
 * Checks if column is at WIP limit
 */
export const isColumnAtLimit = (column: KanbanColumn): boolean => {
  if (!column.maxTasks) return false;
  return column.taskIds.length >= column.maxTasks;
};

/**
 * Gets column task count
 */
export const getColumnTaskCount = (column: KanbanColumn): number => {
  return column.taskIds.length;
};

/**
 * Calculates WIP limit percentage
 */
export const getWIPLimitPercentage = (column: KanbanColumn): number => {
  if (!column.maxTasks) return 0;
  return (column.taskIds.length / column.maxTasks) * 100;
};

/**
 * Gets WIP limit color indicator
 */
export const getWIPLimitColor = (column: KanbanColumn): string => {
  const percentage = getWIPLimitPercentage(column);
  if (percentage >= 100) return 'text-red-600';
  if (percentage >= 80) return 'text-amber-600';
  return 'text-accent-600';
};
