import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import type { KanbanBoardProps, KanbanTask } from './KanbanBoard.types';
import { KanbanColumnComponent } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  tasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeColumnForNewTask, setActiveColumnForNewTask] = useState<string | null>(null);

  const {
    draggedId,
    draggedFromColumn,
    dropTargetColumn,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useDragAndDrop();

  const handleTaskEdit = useCallback((task: KanbanTask) => {
    setSelectedTask(task);
    setActiveColumnForNewTask(null);
    setIsModalOpen(true);
  }, []);

  const handleAddTask = useCallback((columnId: string) => {
    setSelectedTask(null);
    setActiveColumnForNewTask(columnId);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setActiveColumnForNewTask(null);
  }, []);

  const handleTaskSave = useCallback(
    (taskData: Partial<KanbanTask>) => {
      if (selectedTask) {
        // Update existing task
        onTaskUpdate(selectedTask.id, taskData);
      } else if (activeColumnForNewTask) {
        // Create new task
        const newTask: Omit<KanbanTask, 'id' | 'createdAt'> = {
          title: taskData.title || '',
          description: taskData.description,
          status: activeColumnForNewTask,
          priority: taskData.priority,
          assignee: taskData.assignee,
          tags: taskData.tags,
          dueDate: taskData.dueDate,
        };
        onTaskCreate(activeColumnForNewTask, newTask);
      }
    },
    [selectedTask, activeColumnForNewTask, onTaskUpdate, onTaskCreate]
  );

  const handleTaskDeleteClick = useCallback(() => {
    if (selectedTask) {
      onTaskDelete(selectedTask.id);
      handleModalClose();
    }
  }, [selectedTask, onTaskDelete, handleModalClose]);

  const handleDragOverColumn = useCallback(
    (e: React.DragEvent, columnId: string) => {
      e.preventDefault();
      e.stopPropagation();

      const columnElement = e.currentTarget;
      const rect = columnElement.getBoundingClientRect();
      const y = e.clientY - rect.top;

      // Calculate which position to insert at
      const taskElements = Array.from(
        columnElement.querySelectorAll('[draggable="true"]')
      ) as HTMLElement[];

      let insertIndex = taskElements.length;

      for (let i = 0; i < taskElements.length; i++) {
        const taskRect = taskElements[i].getBoundingClientRect();
        const taskMiddle = taskRect.top + taskRect.height / 2 - rect.top;

        if (y < taskMiddle) {
          insertIndex = i;
          break;
        }
      }

      handleDragOver(columnId, insertIndex);
    },
    [handleDragOver]
  );

  const handleDropOnColumn = useCallback(
    (e: React.DragEvent, columnId: string) => {
      e.preventDefault();
      e.stopPropagation();

      if (!draggedId || !draggedFromColumn) return;

      const insertIndex = dragOverIndex !== null ? dragOverIndex : 0;
      onTaskMove(draggedId, draggedFromColumn, columnId, insertIndex);
      handleDragEnd();
    },
    [draggedId, draggedFromColumn, dragOverIndex, onTaskMove, handleDragEnd]
  );

  return (
    <>
      <div className="w-full h-full overflow-x-auto overflow-y-hidden bg-gray-100 p-4">
        <div className="flex gap-4 h-full min-w-max">
          {columns.map((column) => {
            const columnTasks = column.taskIds
              .map((taskId) => tasks[taskId])
              .filter((task): task is KanbanTask => task !== undefined);

            return (
              <KanbanColumnComponent
                key={column.id}
                column={column}
                tasks={columnTasks}
                draggedTaskId={draggedId}
                dropTargetColumn={dropTargetColumn}
                dragOverIndex={dragOverIndex}
                onTaskEdit={handleTaskEdit}
                onTaskDragStart={handleDragStart}
                onTaskDragEnd={handleDragEnd}
                onDragOver={(e, index) => handleDragOverColumn(e, column.id)}
                onDrop={(e) => handleDropOnColumn(e, column.id)}
                onAddTask={handleAddTask}
              />
            );
          })}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        task={selectedTask || undefined}
        columns={columns}
        onClose={handleModalClose}
        onSave={handleTaskSave}
        onDelete={selectedTask ? handleTaskDeleteClick : undefined}
      />
    </>
  );
};
