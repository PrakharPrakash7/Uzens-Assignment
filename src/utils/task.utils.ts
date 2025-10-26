import { format, isPast, isToday, isTomorrow } from 'date-fns';
import type { TaskPriority } from '@/components/KanbanBoard/KanbanBoard.types';

/**
 * Checks if a task is overdue
 */
export const isOverdue = (dueDate: Date): boolean => {
  return isPast(dueDate) && !isToday(dueDate);
};

/**
 * Formats a date for display
 */
export const formatDate = (date: Date): string => {
  if (isToday(date)) {
    return 'Today';
  }
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }
  return format(date, 'MMM d');
};

/**
 * Gets initials from a name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Calculates priority color classes
 */
export const getPriorityColor = (priority: TaskPriority): string => {
  const colors = {
    low: 'bg-blue-50 text-blue-700 border-l-[6px] border-blue-400',
    medium: 'bg-amber-50 text-amber-700 border-l-[6px] border-amber-400',
    high: 'bg-orange-50 text-orange-700 border-l-[6px] border-orange-500',
    urgent: 'bg-red-50 text-red-700 border-l-[6px] border-red-500',
  };
  return colors[priority] || colors.medium;
};

/**
 * Gets priority badge color
 */
export const getPriorityBadgeColor = (priority: TaskPriority): string => {
  const colors = {
    low: 'bg-blue-100 text-blue-700 border-2 border-blue-300',
    medium: 'bg-amber-100 text-amber-700 border-2 border-amber-300',
    high: 'bg-orange-100 text-orange-700 border-2 border-orange-400',
    urgent: 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-2 border-red-400',
  };
  return colors[priority] || colors.medium;
};

/**
 * Reorders tasks after drag and drop within the same column
 */
export const reorderTasks = (
  tasks: string[],
  startIndex: number,
  endIndex: number
): string[] => {
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Moves task between columns
 */
export const moveTaskBetweenColumns = (
  sourceColumn: string[],
  destColumn: string[],
  sourceIndex: number,
  destIndex: number
): { source: string[]; destination: string[] } => {
  const sourceClone = Array.from(sourceColumn);
  const destClone = Array.from(destColumn);
  const [removed] = sourceClone.splice(sourceIndex, 1);
  destClone.splice(destIndex, 0, removed);

  return {
    source: sourceClone,
    destination: destClone,
  };
};

/**
 * Generates a unique ID
 */
export const generateId = (): string => {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Truncates text to a specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
