import { useState } from "react";
import { CreateTaskInput } from "../types/task";

interface AddTaskProps {
  onAdd: (task: CreateTaskInput) => Promise<void> | void;
}

export default function AddTask({ onAdd }: AddTaskProps) {
  const [title, setTitle] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim() });
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 flex gap-2">
      <input
        className="border p-2 flex-1"
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        placeholder="Add task..."
      />
      <button className="bg-blue-500 text-white px-3 py-2">Add</button>
    </form>
  );
}
