export type TaskCategory = "School" | "Work" | "Personal";

export const TASK_CATEGORIES: readonly TaskCategory[] = ["School", "Work", "Personal"] as const;

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  deadline: string;
  completed: boolean;
}

export const STORAGE_KEY = "task-manager-pro.tasks.v1";

export function getStarterTasks(): Task[] {
  return [
    { id: "starter-1", title: "Finish biology lab notes", description: "Summarise chapter 4 microscope observations before Friday.", category: "School", deadline: "2026-12-04", completed: false },
    { id: "starter-2", title: "Send weekly project update", description: "Share milestones and blockers with the team by afternoon.", category: "Work", deadline: "2026-12-02", completed: true },
    { id: "starter-3", title: "Book dentist check-up", description: "Call the clinic and confirm an early morning slot.", category: "Personal", deadline: "2026-12-08", completed: false },
  ];
}

export function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return getStarterTasks();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return getStarterTasks();
    return parsed.filter(isValidTask);
  } catch {
    return getStarterTasks();
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore storage quota or private-mode errors
  }
}

function isValidTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item["id"] === "string" &&
    typeof item["title"] === "string" &&
    typeof item["description"] === "string" &&
    typeof item["deadline"] === "string" &&
    typeof item["completed"] === "boolean" &&
    TASK_CATEGORIES.includes(item["category"] as TaskCategory)
  );
}

export function getTaskStats(tasks: readonly Task[]) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionPercent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, pending, completionPercent };
}

export function formatDeadline(deadline: string): string {
  if (!deadline) return "No deadline";
  const parts = deadline.split("-").map(Number);
  const [year, month, day] = parts;
  if (!year || !month || !day) return deadline;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(year, month - 1, day),
  );
}