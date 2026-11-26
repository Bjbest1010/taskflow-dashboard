import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { TASK_CATEGORIES, type TaskCategory } from "@/lib/tasks";

interface AddTaskFormProps {
  defaultCategory: TaskCategory;
  onAddTask: (input: {
    title: string;
    description: string;
    category: TaskCategory;
    deadline: string;
  }) => void;
}

export function AddTaskForm({ defaultCategory, onAddTask }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TaskCategory>(defaultCategory);
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Please enter a task title.");
      return;
    }

    onAddTask({
      title: cleanTitle,
      description: description.trim(),
      category,
      deadline,
    });

    setTitle("");
    setDescription("");
    setDeadline("");
    setError("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-5 shadow-xs"
      noValidate
    >
      <h2 className="text-lg font-semibold text-card-foreground">Add New Task</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="task-title" className="block text-sm font-medium text-foreground">
            Title
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g. Prepare Monday presentation"
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
          {error && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">
              {error}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="task-description" className="block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            id="task-description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any helpful details or notes..."
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <div>
          <label htmlFor="task-category" className="block text-sm font-medium text-foreground">
            Category
          </label>
          <select
            id="task-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          >
            {TASK_CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="task-deadline" className="block text-sm font-medium text-foreground">
            Deadline
          </label>
          <input
            id="task-deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Task
        </button>
      </div>
    </form>
  );
}