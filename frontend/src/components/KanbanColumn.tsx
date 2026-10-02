import { Task, TaskStatus, UpdateTaskInput } from '../types/task';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  accentColor: string;
  onUpdate: (id: string, updates: UpdateTaskInput) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

export default function KanbanColumn({
  status,
  title,
  tasks,
  accentColor,
  onUpdate,
  onDelete,
}: KanbanColumnProps) {
  return (
    <div
      data-testid={`column-${status}`}
      className="flex flex-col bg-gray-50/80 rounded-xl border border-gray-200/80 overflow-hidden shadow-xs"
    >
      {/* Column Header */}
      <div
        className={`px-4 py-3 border-b border-gray-200/80 flex items-center justify-between ${accentColor}`}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-gray-200 text-gray-600">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Card List Area */}
      <div className="p-3 flex-1 space-y-3 min-h-[200px]">
        {tasks.length === 0 ? (
          <div className="h-full min-h-[140px] flex items-center justify-center text-xs text-gray-400 border-2 border-dashed border-gray-200/60 rounded-lg p-4 text-center">
            No tasks in {title.toLowerCase()}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
