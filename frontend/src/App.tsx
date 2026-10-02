import { useEffect, useState } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "./api";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import { Task, CreateTaskInput, UpdateTaskInput } from "./types/task";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks()
      .then((res) => setTasks(res.data))
      .catch((err: unknown) => console.error("Error fetching tasks:", err));
  }, []);

  const handleAdd = async (task: CreateTaskInput): Promise<void> => {
    try {
      const res = await addTask(task);
      setTasks((prev) => [...prev, res.data]);
    } catch (err: unknown) {
      console.error("Error adding task:", err);
    }
  };

  const handleUpdate = async (id: string, updates: UpdateTaskInput): Promise<void> => {
    try {
      const res = await updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    } catch (err: unknown) {
      console.error("Error updating task:", err);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err: unknown) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 shadow-lg rounded-lg border p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">MERN Task Manager</h1>
      <AddTask onAdd={handleAdd} />
      <TaskList tasks={tasks} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  );
}
