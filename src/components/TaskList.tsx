import { Calendar, Check, Trash2 } from "lucide-react";
import { formatDeadline, type Task } from "@/lib/tasks";
import type { CategoryFilter } from "@/components/TaskSidebar";

interface TaskListProps {
  tasks: readonly Task[];
  activeCategory: CategoryFilter;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({
  tasks,
  activeCategory,
  onToggleComplete,
  onDeleteTask,
}: TaskListProps) {
  const heading = activeCategory === "All" ? "All Tasks" : `${activeCategory} Tasks`;

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-card-foreground">{heading}</h2>
        <span className="text-sm text-muted-foreground tabular-nums">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-border bg-background/60 px-4 py-10 text-center">
          <p className="text-sm font-medium text-foreground">No tasks here yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a task above to start tracking your progress.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-start justify-between gap-3 rounded-lg border p-4 transition-colors ${
                task.completed
                  ? "border-border bg-muted/40"
                  : "border-border bg-background hover:border-primary/40"
              }`}
            >
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <button
                  type="button"
                  onClick={() => onToggleComplete(task.id)}
                  aria-label={task.completed ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as completed`}
                  aria-pressed={task.completed}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                    task.completed
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-card hover:border-primary"
                  }`}
                >
                  {task.completed && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-semibold break-words ${
                      task.completed ? "text-muted-foreground line-through" : "text-foreground"
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="mt-1 text-sm text-muted-foreground break-words">
                      {task.description}
                    </p>
                  )}
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 font-medium text-secondary-foreground">
                      {task.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      {formatDeadline(task.deadline)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onDeleteTask(task.id)}
                aria-label={`Delete "${task.title}"`}
                className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}