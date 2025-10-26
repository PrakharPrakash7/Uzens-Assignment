import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/primitives/Modal';
import { Button } from '@/components/primitives/Button';
import type { KanbanTask, KanbanColumn, TaskPriority, TaskFormData, FormErrors } from './KanbanBoard.types';

export interface TaskModalProps {
  isOpen: boolean;
  task?: KanbanTask;
  columns: KanbanColumn[];
  onClose: () => void;
  onSave: (taskData: Partial<KanbanTask>) => void;
  onDelete?: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  task,
  columns,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    tags: [],
    dueDate: null,
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'medium',
        assignee: task.assignee || '',
        tags: task.tags || [],
        dueDate: task.dueDate || null,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        assignee: '',
        tags: [],
        dueDate: null,
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const taskData: Partial<KanbanTask> = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      assignee: formData.assignee.trim() || undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
      dueDate: formData.dueDate || undefined,
    };

    if (task) {
      taskData.status = task.status;
    }

    onSave(taskData);
    onClose();
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      size="lg"
      footer={
        <>
          {task && onDelete && (
            <Button variant="danger" onClick={onDelete} type="button">
              Delete Task
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} type="submit">
            {task ? 'Update' : 'Create'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="task-title" className="block text-xs font-bold text-gray-900 mb-1">
            TITLE <span className="text-red-600">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border-2 border-gray-900 focus:outline-2 focus:outline-blue-500 font-medium"
            placeholder="Task title"
            autoFocus
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600 font-bold">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="task-description" className="block text-xs font-bold text-gray-900 mb-1">
            DESCRIPTION
          </label>
          <textarea
            id="task-description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border-2 border-gray-900 focus:outline-2 focus:outline-blue-500 min-h-[100px] font-medium"
            placeholder="Description"
          />
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="task-priority" className="block text-xs font-bold text-gray-900 mb-1">
              PRIORITY
            </label>
            <select
              id="task-priority"
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
              className="w-full px-3 py-2 border-2 border-gray-900 focus:outline-2 focus:outline-blue-500 font-medium bg-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {task && (
            <div>
              <label htmlFor="task-status" className="block text-xs font-bold text-gray-900 mb-1">
                STATUS
              </label>
              <select
                id="task-status"
                value={task.status}
                onChange={(e) => {
                  onSave({ ...task, status: e.target.value });
                }}
                className="w-full px-3 py-2 border-2 border-gray-900 focus:outline-2 focus:outline-blue-500 font-medium bg-white"
              >
                {columns.map(col => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Assignee */}
        <div>
          <label htmlFor="task-assignee" className="block text-xs font-bold text-gray-900 mb-1">
            ASSIGNEE
          </label>
          <input
            id="task-assignee"
            type="text"
            value={formData.assignee}
            onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
            className="w-full px-3 py-2 border-2 border-gray-900 focus:outline-2 focus:outline-blue-500 font-medium"
            placeholder="Assignee name"
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="task-tags" className="block text-xs font-bold text-gray-900 mb-1">
            TAGS
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="task-tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="flex-1 px-3 py-2 border-2 border-gray-900 focus:outline-2 focus:outline-blue-500 font-medium"
              placeholder="Add tag"
            />
            <Button type="button" variant="secondary" onClick={handleAddTag}>
              ADD
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 bg-gray-200 text-gray-900 px-2 py-1 text-xs font-bold border-2 border-gray-400"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-600 hover:text-gray-900"
                    aria-label={`Remove ${tag} tag`}
                  >
                    X
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="task-duedate" className="block text-xs font-bold text-gray-900 mb-1">
            DUE DATE
          </label>
          <input
            id="task-duedate"
            type="date"
            value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              dueDate: e.target.value ? new Date(e.target.value) : null 
            }))}
            className="w-full px-3 py-2 border-2 border-gray-900 focus:outline-2 focus:outline-blue-500 font-medium"
          />
        </div>
      </form>
    </Modal>
  );
};
