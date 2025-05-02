
import React from "react";
import { Navigate } from "react-router-dom";
import { CalendarWorker } from "@/components/calendar/CalendarWorker";
import { CalendarAdmin } from "@/components/calendar/CalendarAdmin";
import { getCurrentUser } from "@/lib/auth";

const Calendar = () => {
  const user = getCurrentUser();

  // If no user is logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/" />;
  }

  return user.role === "admin" ? <CalendarAdmin user={user} /> : <CalendarWorker user={user} />;
};

export default Calendar;
