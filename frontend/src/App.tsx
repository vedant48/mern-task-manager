import { useEffect, useState } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "./api";
import AddTask from "./components/AddTask";
import KanbanBoard from "./components/KanbanBoard";
import { Task, CreateTaskInput, UpdateTaskInput } from "./types/task";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = () => {
    setLoading(true);
    setError(null);
    getTasks()
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Error fetching tasks:", err);
        setError("Failed to connect to backend server. Make sure backend is running.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async (task: CreateTaskInput): Promise<void> => {
    try {
      const res = await addTask(task);
      setTasks((prev) => [res.data, ...prev]);
    } catch (err: unknown) {
      console.error("Error adding task:", err);
      throw err;
    }
  };

  const handleUpdate = async (id: string, updates: UpdateTaskInput): Promise<void> => {
    try {
      const res = await updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    } catch (err: unknown) {
      console.error("Error updating task:", err);
      throw err;
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err: unknown) {
      console.error("Error deleting task:", err);
      throw err;
    }
  };

  const todoCount = tasks.filter((t) => t.status === "TODO").length;
  const inProgressCount = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const doneCount = tasks.filter((t) => t.status === "DONE").length;

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
              Streamlined Kanban task management across To Do, In Progress, and Done
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 text-xs font-medium self-start sm:self-auto">
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

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchTasks}
              className="text-xs bg-red-100 hover:bg-red-200 px-2.5 py-1 rounded font-semibold text-red-800 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Add Task Form */}
        <AddTask onAdd={handleAdd} />

        {/* Board Content */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            <div className="inline-block animate-spin text-xl mb-2">⏳</div>
            <div>Loading tasks...</div>
          </div>
        ) : (
          <KanbanBoard
            tasks={tasks}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
