import { useState, useCallback } from 'react';
import type { KanbanColumn, KanbanTask } from '@/components/KanbanBoard/KanbanBoard.types';
import { reorderTasks, moveTaskBetweenColumns, generateId } from '@/utils/task.utils';

interface UseKanbanBoardProps {
  initialColumns: KanbanColumn[];
  initialTasks: Record<string, KanbanTask>;
}

export const useKanbanBoard = ({ initialColumns, initialTasks }: UseKanbanBoardProps) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initialTasks);

  const handleTaskMove = useCallback((
    taskId: string,
    fromColumn: string,
    toColumn: string,
    newIndex: number
  ) => {
    setColumns(prevColumns => {
      const fromCol = prevColumns.find(col => col.id === fromColumn);
      const toCol = prevColumns.find(col => col.id === toColumn);

      if (!fromCol || !toCol) return prevColumns;

      const fromIndex = fromCol.taskIds.indexOf(taskId);
      if (fromIndex === -1) return prevColumns;

      // Same column reorder
      if (fromColumn === toColumn) {
        const newTaskIds = reorderTasks(fromCol.taskIds, fromIndex, newIndex);
        return prevColumns.map(col =>
          col.id === fromColumn ? { ...col, taskIds: newTaskIds } : col
        );
      }

      // Different column move
      const { source, destination } = moveTaskBetweenColumns(
        fromCol.taskIds,
        toCol.taskIds,
        fromIndex,
        newIndex
      );

      return prevColumns.map(col => {
        if (col.id === fromColumn) return { ...col, taskIds: source };
        if (col.id === toColumn) return { ...col, taskIds: destination };
        return col;
      });
    });

    // Update task status
    setTasks(prevTasks => ({
      ...prevTasks,
      [taskId]: { ...prevTasks[taskId], status: toColumn },
    }));
  }, []);

  const handleTaskCreate = useCallback((
    columnId: string,
    taskData: Omit<KanbanTask, 'id' | 'createdAt'>
  ) => {
    const newTask: KanbanTask = {
      ...taskData,
      id: generateId(),
      createdAt: new Date(),
    };

    setTasks(prevTasks => ({
      ...prevTasks,
      [newTask.id]: newTask,
    }));

    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.id === columnId
          ? { ...col, taskIds: [...col.taskIds, newTask.id] }
          : col
      )
    );
  }, []);

  const handleTaskUpdate = useCallback((taskId: string, updates: Partial<KanbanTask>) => {
    setTasks(prevTasks => {
      const task = prevTasks[taskId];
      if (!task) return prevTasks;

      const updatedTask = { ...task, ...updates };

      // If status changed, move task to new column
      if (updates.status && updates.status !== task.status) {
        setColumns(prevColumns => {
          const fromCol = prevColumns.find(col => col.taskIds.includes(taskId));
          const toCol = prevColumns.find(col => col.id === updates.status);

          if (!fromCol || !toCol) return prevColumns;

          return prevColumns.map(col => {
            if (col.id === fromCol.id) {
              return { ...col, taskIds: col.taskIds.filter(id => id !== taskId) };
            }
            if (col.id === toCol.id) {
              return { ...col, taskIds: [...col.taskIds, taskId] };
            }
            return col;
          });
        });
      }

      return {
        ...prevTasks,
        [taskId]: updatedTask,
      };
    });
  }, []);

  const handleTaskDelete = useCallback((taskId: string) => {
    setColumns(prevColumns =>
      prevColumns.map(col => ({
        ...col,
        taskIds: col.taskIds.filter(id => id !== taskId),
      }))
    );

    setTasks(prevTasks => {
      const { [taskId]: deleted, ...rest } = prevTasks;
      return rest;
    });
  }, []);

  return {
    columns,
    tasks,
    handleTaskMove,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
  };
};
