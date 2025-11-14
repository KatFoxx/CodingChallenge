import React, { useEffect } from "react";
import { useState } from "react";
import { Task } from "@/types";

const TaskList = () => {
    const [tasks, setTask] = useState<Task[]>([]);
    const [newDescription, setNewDescription] = useState("");

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
        };
        setTask(prev => [...prev, newTask]);
        setNewDescription("");
    };
    const handleDelete = (id: string) => {
        setTask(prev => prev.filter(task => task.id !== id));
    };
    const handleToggleComplete = (id: string) => {
        setTask(prev =>
            prev.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setTask(prev =>
                prev.map(task =>
                    !task.completed && !task.urgent && new Date().getTime() - task.createdAt.getTime() > 60000
                        ? { ...task, urgent: true }
                        : task
                )
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const completedCount = tasks.filter(t => t.completed).length;
    const incompleteCount = tasks.length - completedCount;

    return (
        <main className="px-4, py-10 text-center flex flex-col min-h screen">
            <h1 className="text-3xl font-bold mb-6">Task List</h1>
            <form onSubmit={handleSubmit} className="mb-6">
                <input value={newDescription} onChange={handleChange} />
                <input type="submit" value="Add Task" className="ml-2 p-1 border rounded bg-blue-500 text-white"/>
            </form>
            <ul className="mb-6">
                {tasks.map(task => (
                    <li key={task.id} className={`mb-2 p-2 border rounded ${task.urgent ? 'bg-red-200' : ''}`}>
                        <span
                            onClick={() => handleToggleComplete(task.id)}
                            style={{ textDecoration: task.completed ? "line-through" : "none", cursor: 'pointer' }}>
                            {task.description}
                        </span>
                        <button onClick={() => handleDelete(task.id)} className="ml-2 p-1 border rounded bg-red-500 text-white">Delete</button>
                    </li>
                ))}
            </ul>
            <div>
                <p>Completed: {completedCount}</p>
                <p>Incomplete: {incompleteCount}</p>
            </div>
        </main>
    )
}
export default TaskList;