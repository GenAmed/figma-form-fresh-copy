
import React from "react";
import { Navigate } from "react-router-dom";
import { CalendarWorker } from "@/components/calendar/CalendarWorker";
import { getCurrentUser } from "@/lib/auth";

const Calendar = () => {
  const user = getCurrentUser();

  // If no user is logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/" />;
  }

  return <CalendarWorker user={user} />;
};

export default Calendar;
