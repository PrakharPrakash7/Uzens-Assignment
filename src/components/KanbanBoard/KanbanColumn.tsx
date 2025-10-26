import React, { useRef } from 'react';
import clsx from 'clsx';
import type { KanbanColumn, KanbanTask } from './KanbanBoard.types';
import { KanbanCard } from './KanbanCard';
import { getColumnTaskCount, getWIPLimitColor, getWIPLimitPercentage } from '@/utils/column.utils';

export interface KanbanColumnProps {
  column: KanbanColumn;
  tasks: KanbanTask[];
  draggedTaskId: string | null;
  dropTargetColumn: string | null;
  dragOverIndex: number | null;
  onTaskEdit: (task: KanbanTask) => void;
  onTaskDragStart: (taskId: string, columnId: string) => void;
  onTaskDragEnd: () => void;
  onDragOver: (e: React.DragEvent, index: number | null) => void;
  onDrop: (e: React.DragEvent) => void;
  onAddTask: (columnId: string) => void;
}

export const KanbanColumnComponent: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  draggedTaskId,
  dropTargetColumn,
  dragOverIndex,
  onTaskEdit,
  onTaskDragStart,
  onTaskDragEnd,
  onDragOver,
  onDrop,
  onAddTask,
}) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const taskCount = getColumnTaskCount(column);
  const wipPercentage = getWIPLimitPercentage(column);
  const isDropTarget = dropTargetColumn === column.id;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDragOver(e, null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDrop(e);
  };

  return (
    <div
      ref={columnRef}
      className="flex flex-col bg-gray-50 border-2 border-gray-900 w-80 flex-shrink-0"
      role="region"
      aria-label={`${column.title} column. ${taskCount} tasks.`}
    >
      {/* Column Header */}
      <div className="px-4 py-3 border-b-2 border-gray-900 bg-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3"
              style={{ backgroundColor: column.color }}
              aria-hidden="true"
            />
            <h3 className="font-bold text-gray-900 text-base uppercase">{column.title}</h3>
            <span className="text-xs font-bold text-gray-700 bg-white px-2 py-1 border border-gray-400">
              {taskCount}
            </span>
          </div>
        </div>

        {column.maxTasks && (
          <div className="flex items-center gap-2 text-xs">
            <span className={clsx('font-bold', getWIPLimitColor(column))}>
              WIP: {taskCount} / {column.maxTasks}
            </span>
            <div className="flex-1 h-2 bg-white border border-gray-400">
              <div
                className={clsx(
                  'h-full',
                  wipPercentage >= 100
                    ? 'bg-red-500'
                    : wipPercentage >= 80
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
                )}
                style={{ width: `${Math.min(wipPercentage, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tasks Container */}
      <div
        className={clsx(
          'flex-1 p-3 space-y-3 overflow-y-auto min-h-[200px] max-h-[calc(100vh-280px)]',
          isDropTarget && 'bg-blue-100'
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {tasks.length === 0 && !isDropTarget && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 text-sm border-2 border-dashed border-gray-300 bg-white">
            <span className="font-bold">DROP HERE</span>
          </div>
        )}

        {tasks.map((task, index) => {
          const isDragging = draggedTaskId === task.id;
          const showDropIndicator = isDropTarget && dragOverIndex === index;

          return (
            <React.Fragment key={task.id}>
              {showDropIndicator && (
                <div className="h-2 bg-blue-500 border-2 border-blue-700" />
              )}
              <KanbanCard
                task={task}
                isDragging={isDragging}
                onEdit={onTaskEdit}
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('text/plain', task.id);
                  onTaskDragStart(task.id, column.id);
                }}
                onDragEnd={onTaskDragEnd}
              />
            </React.Fragment>
          );
        })}

        {isDropTarget && dragOverIndex === tasks.length && (
          <div className="h-2 bg-blue-500 border-2 border-blue-700" />
        )}
      </div>

      {/* Add Task Button */}
      <div className="p-3 border-t-2 border-gray-900 bg-gray-200">
        <button
          onClick={() => onAddTask(column.id)}
          className="w-full py-2 px-3 text-sm font-bold text-gray-900 bg-white hover:bg-gray-100 border-2 border-gray-900 uppercase"
        >
          + ADD TASK
        </button>
      </div>
    </div>
  );
};
