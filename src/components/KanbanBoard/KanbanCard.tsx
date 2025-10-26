import React from 'react';
import clsx from 'clsx';
import type { KanbanTask } from './KanbanBoard.types';
import {
  formatDate,
  isOverdue,
} from '@/utils/task.utils';
import { Avatar } from '@/components/primitives/Avatar';

export interface KanbanCardProps {
  task: KanbanTask;
  isDragging: boolean;
  onEdit: (task: KanbanTask) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  isDragging,
  onEdit,
  onDragStart,
  onDragEnd,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onEdit(task);
    }
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onEdit(task)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${task.title}. ${task.priority ? `Priority: ${task.priority}.` : ''} ${
        task.assignee ? `Assigned to: ${task.assignee}.` : ''
      } Press Enter to edit.`}
      className={clsx(
        'bg-white border-2 border-gray-300 p-3 cursor-grab',
        'hover:bg-gray-50',
        'focus:outline-2 focus:outline-blue-500',
        isDragging && 'opacity-50'
      )}
    >
      {/* Priority bar on left */}
      {task.priority && (
        <div
          className={clsx(
            'absolute left-0 top-0 bottom-0 w-1',
            task.priority === 'urgent' && 'bg-red-500',
            task.priority === 'high' && 'bg-orange-500',
            task.priority === 'medium' && 'bg-yellow-500',
            task.priority === 'low' && 'bg-blue-500'
          )}
        />
      )}

      <div className="flex items-start justify-between mb-2">
        <h4 className="font-bold text-sm text-gray-900 flex-1 pr-2">
          {task.title}
        </h4>
        {task.priority && (
          <span
            className={clsx(
              'text-xs px-2 py-1 font-bold uppercase border-2',
              task.priority === 'urgent' && 'bg-red-100 text-red-700 border-red-400',
              task.priority === 'high' && 'bg-orange-100 text-orange-700 border-orange-400',
              task.priority === 'medium' && 'bg-yellow-100 text-yellow-700 border-yellow-400',
              task.priority === 'low' && 'bg-blue-100 text-blue-700 border-blue-400'
            )}
          >
            {task.priority}
          </span>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 mb-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
        <div className="flex gap-1 flex-wrap">
          {task.tags?.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs bg-gray-200 text-gray-700 px-2 py-1 font-medium"
            >
              {tag}
            </span>
          ))}
          {task.tags && task.tags.length > 3 && (
            <span className="text-xs text-gray-500 px-1">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
        {task.assignee && <Avatar name={task.assignee} size="sm" />}
      </div>

      {task.dueDate && (
        <div
          className={clsx(
            'text-xs mt-2 font-bold',
            isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-600'
          )}
        >
          DUE: {formatDate(task.dueDate).toUpperCase()}
        </div>
      )}
    </div>
  );
};
