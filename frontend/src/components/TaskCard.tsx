import { useState } from 'react';
import { Task, TaskPriority, TaskStatus, UpdateTaskInput } from '../types/task';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: UpdateTaskInput) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);
  const [editDueDate, setEditDueDate] = useState(
    task.dueDate ? task.dueDate.slice(0, 10) : ''
  );
  const [editStatus, setEditStatus] = useState<TaskStatus>(task.status);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await onUpdate(task.id, {
        title: editTitle.trim(),
        priority: editPriority,
        dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
        status: editStatus,
      });
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    await onUpdate(task.id, { status: newStatus });
  };

  const getPriorityBadgeClass = (priority: TaskPriority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'LOW':
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formatDueDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleSave}
        className="bg-white p-3 rounded-lg border border-blue-200 shadow-sm space-y-2.5 text-sm"
      >
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Title
          </label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Status
            </label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
              className="w-full border rounded px-2 py-1 text-xs bg-white"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Priority
            </label>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
              className="w-full border rounded px-2 py-1 text-xs bg-white"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="w-full border rounded px-2 py-1 text-xs"
          />
        </div>

        <div className="flex justify-end gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 font-medium cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-xs hover:shadow-sm transition-shadow space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`text-sm font-medium leading-snug break-words ${
            task.status === 'DONE' ? 'line-through text-gray-400' : 'text-gray-900'
          }`}
        >
          {task.title}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            title="Edit task"
            className="text-gray-400 hover:text-gray-600 p-1 text-xs rounded hover:bg-gray-100 cursor-pointer"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            title="Delete task"
            className="text-gray-400 hover:text-red-600 p-1 text-xs rounded hover:bg-gray-100 cursor-pointer"
          >
            ❌
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${getPriorityBadgeClass(
              task.priority
            )}`}
          >
            {task.priority}
          </span>

          {task.dueDate && (
            <span
              title="Due date"
              className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full"
            >
              📅 {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>

        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
          aria-label="Change status"
          className="text-[11px] border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50 text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>
    </div>
  );
}
