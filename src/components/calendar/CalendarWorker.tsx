
import React from "react";
import { User } from "@/lib/auth";
import { WorkerCalendar } from "./worker/WorkerCalendar";

interface CalendarWorkerProps {
  user: User;
}

export const CalendarWorker: React.FC<CalendarWorkerProps> = ({ user }) => {
  return <WorkerCalendar user={user} />;
};
