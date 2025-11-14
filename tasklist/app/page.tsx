"use client";
import dynamic from "next/dynamic";
const TaskList = dynamic(() => import("@/components/TaskList"), { ssr: false });

export default function Home() {
  return (
    <div>
      <TaskList />
    </div>
  );
}
