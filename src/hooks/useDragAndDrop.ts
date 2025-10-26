import { useState, useCallback } from 'react';
import type { DragState } from '@/components/KanbanBoard/KanbanBoard.types';

export const useDragAndDrop = () => {
  const [state, setState] = useState<DragState>({
    isDragging: false,
    draggedId: null,
    draggedFromColumn: null,
    dropTargetColumn: null,
    dragOverIndex: null,
  });

  const handleDragStart = useCallback((taskId: string, columnId: string) => {
    setState({
      isDragging: true,
      draggedId: taskId,
      draggedFromColumn: columnId,
      dropTargetColumn: null,
      dragOverIndex: null,
    });
  }, []);

  const handleDragOver = useCallback((columnId: string, index: number | null) => {
    setState(prev => ({
      ...prev,
      dropTargetColumn: columnId,
      dragOverIndex: index,
    }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setState({
      isDragging: false,
      draggedId: null,
      draggedFromColumn: null,
      dropTargetColumn: null,
      dragOverIndex: null,
    });
  }, []);

  const clearDragOver = useCallback(() => {
    setState(prev => ({
      ...prev,
      dropTargetColumn: null,
      dragOverIndex: null,
    }));
  }, []);

  return {
    ...state,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    clearDragOver,
  };
};
