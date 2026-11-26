import { beforeEach, describe, expect, it } from "vitest";
import { getTaskStats, loadTasks, saveTasks, STORAGE_KEY, type Task } from "@/lib/tasks";

describe("Task Manager Pro task logic", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("calculates total, completed, pending, and completion percentage", () => {
    const sample: Task[] = [
      { id: "1", title: "A", description: "", category: "School", deadline: "", completed: true },
      { id: "2", title: "B", description: "", category: "Work", deadline: "", completed: false },
      { id: "3", title: "C", description: "", category: "Personal", deadline: "", completed: true },
      { id: "4", title: "D", description: "", category: "Work", deadline: "", completed: false },
    ];

    expect(getTaskStats(sample)).toEqual({
      total: 4,
      completed: 2,
      pending: 2,
      completionPercent: 50,
    });
  });

  it("returns 0% completion when there are no tasks", () => {
    expect(getTaskStats([])).toEqual({
      total: 0,
      completed: 0,
      pending: 0,
      completionPercent: 0,
    });
  });

  it("persists an emptied task list in localStorage instead of reloading starter tasks", () => {
    saveTasks([]);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("[]");
    expect(loadTasks()).toEqual([]);
  });
});