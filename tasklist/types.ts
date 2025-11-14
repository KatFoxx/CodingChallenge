export const TASK_CATEGORIES = ["Work", "Personal", "Holiday", "Household"] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number];

export type Task = {
    id: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    urgent: boolean;
    category: TaskCategory;
};