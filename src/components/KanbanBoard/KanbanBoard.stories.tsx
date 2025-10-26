import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { KanbanBoard } from './KanbanBoard';
import { getInitialColumns, sampleTasks, sampleColumns, generateMockTasks } from './KanbanBoard.data';
import type { KanbanColumn, KanbanTask } from './KanbanBoard.types';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Components/KanbanBoard',
  component: KanbanBoard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A fully functional Kanban board component with drag-and-drop functionality, task management, and accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

// Interactive wrapper component for Storybook
const KanbanBoardWrapper = ({ 
  initialColumns, 
  initialTasks 
}: { 
  initialColumns: KanbanColumn[]; 
  initialTasks: Record<string, KanbanTask>; 
}) => {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);

  const handleTaskMove = (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => {
    setColumns(prevColumns => {
      const fromCol = prevColumns.find(col => col.id === fromColumn);
      const toCol = prevColumns.find(col => col.id === toColumn);

      if (!fromCol || !toCol) return prevColumns;

      const fromIndex = fromCol.taskIds.indexOf(taskId);
      if (fromIndex === -1) return prevColumns;

      // Create new arrays
      const newFromTaskIds = [...fromCol.taskIds];
      const newToTaskIds = fromColumn === toColumn ? newFromTaskIds : [...toCol.taskIds];

      // Remove from source
      newFromTaskIds.splice(fromIndex, 1);

      // Add to destination
      if (fromColumn === toColumn) {
        newFromTaskIds.splice(newIndex, 0, taskId);
      } else {
        newToTaskIds.splice(newIndex, 0, taskId);
      }

      return prevColumns.map(col => {
        if (col.id === fromColumn) return { ...col, taskIds: newFromTaskIds };
        if (col.id === toColumn) return { ...col, taskIds: newToTaskIds };
        return col;
      });
    });

    setTasks(prevTasks => ({
      ...prevTasks,
      [taskId]: { ...prevTasks[taskId], status: toColumn },
    }));
  };

  const handleTaskCreate = (columnId: string, taskData: Omit<KanbanTask, 'id' | 'createdAt'>) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask: KanbanTask = {
      ...taskData,
      id: newTaskId,
      createdAt: new Date(),
    };

    setTasks(prev => ({
      ...prev,
      [newTaskId]: newTask,
    }));

    setColumns(prev =>
      prev.map(col =>
        col.id === columnId
          ? { ...col, taskIds: [...col.taskIds, newTaskId] }
          : col
      )
    );
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<KanbanTask>) => {
    setTasks(prev => {
      const task = prev[taskId];
      if (!task) return prev;

      const updatedTask = { ...task, ...updates };

      // If status changed, move to new column
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
        ...prev,
        [taskId]: updatedTask,
      };
    });
  };

  const handleTaskDelete = (taskId: string) => {
    setColumns(prev =>
      prev.map(col => ({
        ...col,
        taskIds: col.taskIds.filter(id => id !== taskId),
      }))
    );

    setTasks(prev => {
      const { [taskId]: deleted, ...rest } = prev;
      return rest;
    });
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <KanbanBoard
        columns={columns}
        tasks={tasks}
        onTaskMove={handleTaskMove}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
    </div>
  );
};

/**
 * Default Kanban board with sample data
 */
export const Default: Story = {
  render: () => (
    <KanbanBoardWrapper
      initialColumns={getInitialColumns()}
      initialTasks={sampleTasks}
    />
  ),
};

/**
 * Empty board with no tasks
 */
export const EmptyState: Story = {
  render: () => (
    <KanbanBoardWrapper
      initialColumns={sampleColumns}
      initialTasks={{}}
    />
  ),
};

/**
 * Board with many tasks to test performance
 */
export const LargeDataset: Story = {
  render: () => {
    const { columns, tasks } = generateMockTasks(30);
    return (
      <KanbanBoardWrapper
        initialColumns={columns}
        initialTasks={tasks}
      />
    );
  },
};

/**
 * Board demonstrating different priority levels
 */
export const DifferentPriorities: Story = {
  render: () => {
    const priorityColumns: KanbanColumn[] = [
      { id: 'urgent', title: 'Urgent', color: '#ef4444', taskIds: ['task-urgent'], maxTasks: 5 },
      { id: 'high', title: 'High Priority', color: '#f59e0b', taskIds: ['task-high'], maxTasks: 8 },
      { id: 'medium', title: 'Medium Priority', color: '#3b82f6', taskIds: ['task-medium'], maxTasks: 10 },
      { id: 'low', title: 'Low Priority', color: '#10b981', taskIds: ['task-low'] },
    ];

    const priorityTasks: Record<string, KanbanTask> = {
      'task-urgent': {
        id: 'task-urgent',
        title: 'Critical Bug Fix Required',
        description: 'Production system is down, immediate action needed',
        status: 'urgent',
        priority: 'urgent',
        assignee: 'John Doe',
        tags: ['bug', 'critical'],
        createdAt: new Date(),
        dueDate: new Date(),
      },
      'task-high': {
        id: 'task-high',
        title: 'Complete Feature Implementation',
        description: 'High priority feature for next release',
        status: 'high',
        priority: 'high',
        assignee: 'Jane Smith',
        tags: ['feature', 'release'],
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      'task-medium': {
        id: 'task-medium',
        title: 'Update Documentation',
        description: 'Keep docs in sync with latest changes',
        status: 'medium',
        priority: 'medium',
        assignee: 'Bob Wilson',
        tags: ['docs'],
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      'task-low': {
        id: 'task-low',
        title: 'Refactor Old Code',
        description: 'Technical debt cleanup',
        status: 'low',
        priority: 'low',
        assignee: 'Alice Brown',
        tags: ['refactor', 'tech-debt'],
        createdAt: new Date(),
      },
    };

    return (
      <KanbanBoardWrapper
        initialColumns={priorityColumns}
        initialTasks={priorityTasks}
      />
    );
  },
};

/**
 * Interactive playground with fully functional features
 */
export const InteractivePlayground: Story = {
  render: () => (
    <KanbanBoardWrapper
      initialColumns={getInitialColumns()}
      initialTasks={sampleTasks}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive Kanban board. Try dragging tasks between columns, creating new tasks, editing existing ones, and deleting tasks.',
      },
    },
  },
};

/**
 * Mobile responsive view
 */
export const MobileView: Story = {
  render: () => (
    <KanbanBoardWrapper
      initialColumns={getInitialColumns()}
      initialTasks={sampleTasks}
    />
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Board optimized for mobile viewing with horizontal scrolling.',
      },
    },
  },
};

/**
 * Accessibility demonstration with keyboard navigation
 */
export const Accessibility: Story = {
  render: () => (
    <div>
      <div className="bg-primary-50 border border-primary-200 p-4 mb-4 rounded-lg">
        <h3 className="font-semibold text-neutral-900 mb-2">Keyboard Navigation Guide</h3>
        <ul className="space-y-1 text-sm text-neutral-700">
          <li><kbd className="px-2 py-1 bg-white rounded border">Tab</kbd> - Navigate between tasks</li>
          <li><kbd className="px-2 py-1 bg-white rounded border">Enter</kbd> or <kbd className="px-2 py-1 bg-white rounded border">Space</kbd> - Open task details</li>
          <li><kbd className="px-2 py-1 bg-white rounded border">Esc</kbd> - Close modal</li>
          <li><kbd className="px-2 py-1 bg-white rounded border">Arrow Keys</kbd> - Navigate in modal forms</li>
        </ul>
      </div>
      <KanbanBoardWrapper
        initialColumns={getInitialColumns()}
        initialTasks={sampleTasks}
      />
    </div>
  ),
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'label',
            enabled: true,
          },
        ],
      },
    },
    docs: {
      description: {
        story: 'Fully accessible Kanban board with ARIA labels, keyboard navigation, and screen reader support.',
      },
    },
  },
};
