import { Briefcase, CheckSquare, GraduationCap, LayoutGrid, User, X } from "lucide-react";
import { TASK_CATEGORIES, type Task, type TaskCategory } from "@/lib/tasks";

export type CategoryFilter = "All" | TaskCategory;

interface TaskSidebarProps {
  tasks: readonly Task[];
  activeCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const CATEGORY_ICONS: Record<CategoryFilter, typeof LayoutGrid> = {
  All: LayoutGrid,
  School: GraduationCap,
  Work: Briefcase,
  Personal: User,
};

export function TaskSidebar({
  tasks,
  activeCategory,
  onSelectCategory,
  mobileOpen,
  onCloseMobile,
}: TaskSidebarProps) {
  const navItems: { id: CategoryFilter; label: string; count: number }[] = [
    { id: "All", label: "All Tasks", count: tasks.length },
    ...TASK_CATEGORIES.map((category) => ({
      id: category,
      label: category,
      count: tasks.filter((task) => task.category === category).length,
    })),
  ];

  function handleSelect(category: CategoryFilter) {
    onSelectCategory(category);
    onCloseMobile();
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CheckSquare className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Task Manager Pro</span>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Task categories" className="flex-1 space-y-1 p-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Categories
        </p>
        {navItems.map((item) => {
          const Icon = CATEGORY_ICONS[item.id];
          const isActive = activeCategory === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border lg:block">
        <div className="sticky top-0 h-screen">{sidebarContent}</div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Close menu backdrop"
            onClick={onCloseMobile}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-[1px]"
          />
          <aside className="relative z-10 w-72 max-w-[85vw] border-r border-sidebar-border shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}