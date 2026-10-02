import { useEffect, useMemo, useState } from 'react';
import { getTasks, addTask, updateTask, deleteTask } from './api';
import KanbanBoard from './components/KanbanBoard';
import TaskFilterBar from './components/TaskFilterBar';
import TaskInsights from './components/TaskInsights';
import TaskModal from './components/TaskModal';
import {
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskInput,
  UpdateTaskInput,
} from './types/task';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>(
    'ALL'
  );
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');

  // Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    task: Task | null;
  }>({
    isOpen: false,
    task: null,
  });

  const fetchTasks = () => {
    setLoading(true);
    setError(null);
    getTasks()
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error('Error fetching tasks:', err);
        setError(
          'Failed to connect to backend server. Make sure backend is running.'
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleModalSubmit = async (
    data: CreateTaskInput | UpdateTaskInput
  ): Promise<void> => {
    if (modalState.task) {
      // Edit mode
      const res = await updateTask(modalState.task.id, data as UpdateTaskInput);
      setTasks((prev) =>
        prev.map((t) => (t.id === modalState.task?.id ? res.data : t))
      );
    } else {
      // Create mode
      const res = await addTask(data as CreateTaskInput);
      setTasks((prev) => [res.data, ...prev]);
    }
  };

  const handleQuickStatusUpdate = async (
    id: string,
    updates: UpdateTaskInput
  ): Promise<void> => {
    try {
      const res = await updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    } catch (err: unknown) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
      throw err;
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err: unknown) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
      throw err;
    }
  };

  const handleDropTask = async (
    taskId: string,
    targetStatus: TaskStatus
  ): Promise<void> => {
    const taskToMove = tasks.find((t) => t.id === taskId);
    // Prevent duplicate status requests when dropped into its current column
    if (!taskToMove || taskToMove.status === targetStatus) {
      return;
    }

    // Capture snapshot for rollback
    const previousTasks = [...tasks];

    // Optimistically update UI state
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: targetStatus,
            completed: targetStatus === 'DONE',
          };
        }
        return t;
      })
    );
    setError(null);

    try {
      // Persist status change via REST API
      const res = await updateTask(taskId, { status: targetStatus });
      // Reconcile with server response
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
    } catch (err: unknown) {
      console.error('Error moving task:', err);
      // Rollback to previous state on failure
      setTasks(previousTasks);
      setError(
        `Failed to move task "${taskToMove.title}" to ${targetStatus.replace(
          '_',
          ' '
        )}. Changes were rolled back.`
      );
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setPriorityFilter('ALL');
    setStatusFilter('ALL');
  };

  const isFiltered =
    searchQuery.trim() !== '' ||
    priorityFilter !== 'ALL' ||
    statusFilter !== 'ALL';

  // Client-side filtering logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search by title (case-insensitive)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        if (!task.title.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Filter by priority
      if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) {
        return false;
      }

      // Filter by status
      if (statusFilter !== 'ALL' && task.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [tasks, searchQuery, priorityFilter, statusFilter]);

  const todoCount = tasks.filter((t) => t.status === 'TODO').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const doneCount = tasks.filter((t) => t.status === 'DONE').length;

  return (
    <div className="min-h-screen bg-slate-50/50 text-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📋</span>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                TaskFlow
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Streamlined Kanban task management across To Do, In Progress, and
              Done
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 text-xs font-medium self-start sm:self-auto flex-wrap">
            <span className="bg-white border border-gray-200 px-2.5 py-1 rounded-lg text-gray-700 shadow-2xs">
              Total: {tasks.length}
            </span>
            <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700">
              To Do: {todoCount}
            </span>
            <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg text-blue-700">
              In Progress: {inProgressCount}
            </span>
            <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-emerald-700">
              Done: {doneCount}
            </span>
          </div>
        </header>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchTasks}
                className="text-xs bg-red-100 hover:bg-red-200 px-2.5 py-1 rounded font-semibold text-red-800 cursor-pointer"
              >
                Retry
              </button>
              <button
                onClick={() => setError(null)}
                className="text-xs text-red-600 hover:text-red-800 font-bold px-1.5 py-0.5 cursor-pointer"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Search, Filter & Actions Toolbar */}
        <TaskFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onClearFilters={handleClearFilters}
          onOpenCreateModal={() =>
            setModalState({ isOpen: true, task: null })
          }
          totalCount={tasks.length}
          filteredCount={filteredTasks.length}
        />

        {/* Task Insights Analytics Dashboard */}
        <TaskInsights tasks={tasks} />

        {/* Board Content */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            <div className="inline-block animate-spin text-xl mb-2">⏳</div>
            <div>Loading tasks...</div>
          </div>
        ) : tasks.length === 0 ? (
          /* Empty State: No tasks exist */
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-2xs p-8 max-w-md mx-auto my-6 space-y-3">
            <span className="text-4xl block">✨</span>
            <h3 className="text-base font-semibold text-gray-800">
              No tasks yet
            </h3>
            <p className="text-xs text-gray-500">
              Get started by creating your first task to populate your Kanban board.
            </p>
            <button
              type="button"
              onClick={() => setModalState({ isOpen: true, task: null })}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 text-xs rounded-lg shadow-xs cursor-pointer"
            >
              <span>+ Add Task</span>
            </button>
          </div>
        ) : isFiltered && filteredTasks.length === 0 ? (
          /* Empty State: No tasks match current filter/search */
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center justify-between">
              <span>No tasks match your current search and filter criteria.</span>
              <button
                type="button"
                onClick={handleClearFilters}
                className="font-semibold underline hover:text-amber-950 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
            <KanbanBoard
              tasks={filteredTasks}
              isFiltered={isFiltered}
              onUpdate={handleQuickStatusUpdate}
              onDelete={handleDelete}
              onDropTask={handleDropTask}
              onEdit={(task) => setModalState({ isOpen: true, task })}
            />
          </div>
        ) : (
          <KanbanBoard
            tasks={filteredTasks}
            isFiltered={isFiltered}
            onUpdate={handleQuickStatusUpdate}
            onDelete={handleDelete}
            onDropTask={handleDropTask}
            onEdit={(task) => setModalState({ isOpen: true, task })}
          />
        )}

        {/* Task Modal (Create / Edit) */}
        <TaskModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ isOpen: false, task: null })}
          task={modalState.task}
          onSubmit={handleModalSubmit}
        />
      </div>
    </div>
  );
}
