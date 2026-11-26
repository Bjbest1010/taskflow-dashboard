import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, CheckSquare, Clock, ListTodo, Menu } from "lucide-react";
import { AddTaskForm } from "@/components/AddTaskForm";
import { TaskList } from "@/components/TaskList";
import { TaskSidebar, type CategoryFilter } from "@/components/TaskSidebar";
import { getTaskStats, loadTasks, saveTasks, type Task, type TaskCategory } from "@/lib/tasks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Task Manager Pro" },
      {
        name: "description",
        content: "Manage School, Work, and Personal tasks with deadlines and a live completion progress bar.",
      },
      { property: "og:title", content: "Task Manager Pro" },
      {
        property: "og:description",
        content: "Manage School, Work, and Personal tasks with deadlines and a live completion progress bar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TaskManagerDashboard,
});

function TaskManagerDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setTasks(loadTasks());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveTasks(tasks);
  }, [tasks, loaded]);

  function handleAddTask(input: {
    title: string;
    description: string;
    category: TaskCategory;
    deadline: string;
  }) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      category: input.category,
      deadline: input.deadline,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  }

  function handleToggleComplete(id: string) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  }

  function handleDeleteTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  const visibleTasks =
    activeCategory === "All"
      ? tasks
      : tasks.filter((task) => task.category === activeCategory);

  const stats = getTaskStats(tasks);
  const formDefaultCategory: TaskCategory = activeCategory === "All" ? "School" : activeCategory;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <TaskSidebar
        tasks={tasks}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3.5 backdrop-blur-xs lg:hidden">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CheckSquare className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="font-display text-base font-bold">Task Manager Pro</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open categories menu"
            className="rounded-lg border border-border p-2 text-foreground hover:bg-accent"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep track of your School, Work, and Personal tasks in one place.
            </p>
          </div>

          <section aria-label="Task summary" className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Tasks</span>
                <ListTodo className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <p className="mt-2 font-display text-3xl font-bold tabular-nums">{stats.total}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Completed</span>
                <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
              </div>
              <p className="mt-2 font-display text-3xl font-bold text-primary tabular-nums">
                {stats.completed}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Pending</span>
                <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>
              <p className="mt-2 font-display text-3xl font-bold tabular-nums">{stats.pending}</p>
            </div>
          </section>

          <section
            aria-label="Completion progress"
            className="rounded-xl border border-border bg-card p-5 shadow-xs"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-card-foreground">Task Completion Progress</span>
              <span className="font-semibold text-primary tabular-nums">
                {stats.completionPercent}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-label="Task completion progress"
              aria-valuenow={stats.completionPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-3 h-3 w-full overflow-hidden rounded-full bg-secondary"
            >
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${stats.completionPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {stats.completed} of {stats.total} {stats.total === 1 ? "task" : "tasks"} completed
            </p>
          </section>

          <AddTaskForm
            key={formDefaultCategory}
            defaultCategory={formDefaultCategory}
            onAddTask={handleAddTask}
          />

          <TaskList
            tasks={visibleTasks}
            activeCategory={activeCategory}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
          />
        </main>
      </div>
    </div>
  );
}
