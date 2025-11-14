"use client";
import React, { useState, useEffect } from "react";
import { Task } from "@/types";
import { TaskCategory } from "@/types";

const TaskList = () => {
    {/* State management for tasks and form inputs */ }
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newDescription, setNewDescription] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingDescription, setEditingDescription] = useState("");
    const [category, setCategory] = useState<TaskCategory>("Work");

    {/* Handlers for form inputs and task actions */ }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewDescription(e.target.value);
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newDescription.trim() === "") return;
        const newTask: Task = {
            id: Date.now().toString(),
            description: newDescription,
            completed: false,
            createdAt: new Date(),
            urgent: false,
            category: category,
        };
        setTasks(prev => [...prev, newTask]);
        setNewDescription("");
    };
    const handleDelete = (id: string) => {
        setTasks(prev => prev.filter(task => task.id !== id));
    };
    const handleToggleComplete = (id: string) => {
        setTasks(prev =>
            prev.map(task =>
                task.id === id ? { ...task, completed: !task.completed, urgent: false }
                    : task
            )
        );
    };
    const handleEdit = (tasks: Task) => {
        if (tasks.completed) return;
        setEditingId(tasks.id);
        setEditingDescription(tasks.description);
    };
    const handleEditSave = (id: string) => {
        setTasks(prev =>
            prev.map(task =>
                task.id === id ? { ...task, description: editingDescription } : task
            )
        );
        setEditingId(null);
        setEditingDescription("");
    };
    const handleCategoryChange = (tasks: Task) => {
        setCategory(tasks.category as TaskCategory);
    }
    useEffect(() => {
        const interval = setInterval(() => {
            setTasks(prev =>
                prev.map(task =>
                    !task.completed && !task.urgent && new Date().getTime() - task.createdAt.getTime() > 60000
                        ? { ...task, urgent: true }
                        : task
                )
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const completedCount = tasks.filter(t => t.completed).length;
    const incompleteCount = tasks.length - completedCount;

    {/* Would be nice to change the buttons to icons if I have the time */ }
    return (
        <main className="px-4 py-10 text-center flex flex-col min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Task List</h1>
            <form onSubmit={handleSubmit} className="mb-6">
                <input value={newDescription} onChange={handleChange} />
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)} className="ml-2 p-1 border rounded" />
                <input type="submit" value="Save" className="ml-2 p-1 border rounded bg-blue-500 text-white" />
            </form>
            <ul className="mb-6">
                {tasks.map(task => (
                    <li
                        key={task.id}
                        className={`mb-2 p-2 border rounded flex items-center justify-between ${task.urgent ? 'bg-red-200 text-red-700' : ''}`}
                    >

                        <span className="w-40 text-left text-sm text-gray-500">
                            {task.createdAt.toLocaleString()}
                        </span>


                        <span className="flex-1 text-center px-4">
                            {editingId === task.id ? (
                                <div className="flex items-center">
                                    <input
                                        value={editingDescription}
                                        onChange={e => setEditingDescription(e.target.value)}
                                        className="border p-1 rounded w-full"
                                    />
                                    <button
                                        onClick={() => handleEditSave(task.id)}
                                        className="ml-2 p-1 border rounded bg-green-500 text-white"
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <><span
                                    style={{
                                        textDecoration: task.completed ? "line-through" : "none",
                                        cursor: task.completed ? "default" : "pointer"
                                    }}
                                >
                                    {task.description}
                                </span><span className="ml-2">{task.category}</span>
                                    {task.urgent ? (
                                        <span className="ml-2 text-red-700 font-bold">Urgent</span>) : null}
                                </>
                            )}
                        </span>


                        <span className="flex items-center gap-2" >
                            {!task.completed && editingId !== task.id && (
                                <button
                                    onClick={() => handleEdit(task)}
                                    className="p-1 border rounded bg-yellow-500 text-white"
                                >
                                    Edit
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(task.id)}
                                className="p-1 border rounded bg-red-500 text-white"
                            >
                                Delete
                            </button>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggleComplete(task.id)}
                                className="ml-2"
                            />
                        </span>
                    </li>
                ))
                }
            </ul >
            <div>
                <p>Completed Tasks: {completedCount}</p>
                <p>Incomplete Tasks: {incompleteCount}</p>
            </div>
        </main >
    )
}
export default TaskList;