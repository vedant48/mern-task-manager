import { Task, UpdateTaskInput } from "../types/task";

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: string, updates: UpdateTaskInput) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

export default function TaskList({ tasks, onUpdate, onDelete }: TaskListProps) {
  return (
    <ul className="p-2">
      {tasks.map((task) => (
        <li key={task.id} className="flex justify-between items-center p-2 border-b">
          <span
            onClick={() => onUpdate(task.id, { completed: !task.completed })}
            className={task.completed ? "line-through cursor-pointer" : "cursor-pointer"}
          >
            {task.title}
          </span>
          <button onClick={() => onDelete(task.id)} className="text-red-500">❌</button>
        </li>
      ))}
    </ul>
  );
}
