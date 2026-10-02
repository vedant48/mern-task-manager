import { useState } from 'react';
import { CreateTaskInput, TaskPriority, TaskStatus } from '../types/task';

interface AddTaskProps {
  onAdd: (task: CreateTaskInput) => Promise<void> | void;
}

export default function AddTask({ onAdd }: AddTaskProps) {
  const [title, setTitle] = useState<string>('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState<string>('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const payload: CreateTaskInput = {
        title: title.trim(),
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      };

      await onAdd(payload);
      setTitle('');
      setDueDate('');
      setPriority('MEDIUM');
      setStatus('TODO');
      setShowDetails(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs mb-6 space-y-3"
    >
      <div className="flex gap-2 items-center">
        <input
          className="border border-gray-300 rounded-lg px-3.5 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-gray-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          required
        />
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          title="Toggle extra task details"
          className="px-3 py-2 text-xs font-medium border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer"
        >
          {showDetails ? 'Simple' : 'Options'}
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </button>
      </div>

      {showDetails && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100 text-xs">
          <div>
            <label className="block text-gray-500 font-semibold mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 cursor-pointer"
            >
              <option value="TODO">To Do (Default)</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-500 font-semibold mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 cursor-pointer"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium (Default)</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-500 font-semibold mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-700"
            />
          </div>
        </div>
      )}
    </form>
  );
}
