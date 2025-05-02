
import { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

// Type pour un événement calendrier
export type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  status?: "confirmed" | "pending" | "cancelled";
  type?: string;
  notes?: string;
  color?: string;
};

interface UseCalendarProps {
  initialEvents?: CalendarEvent[];
  startDate?: Date;
}

export const useCalendar = ({ initialEvents = [], startDate }: UseCalendarProps = {}) => {
  const [currentDate, setCurrentDate] = useState<Date>(startDate || new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Navigation des mois
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  
  // Jours de la semaine courante
  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
    end: endOfWeek(selectedDate, { weekStartsOn: 1 })
  });

  // Ajouter un événement
  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = {
      ...event,
      id: `event-${Date.now()}`
    };
    setEvents(prevEvents => [...prevEvents, newEvent]);
    return newEvent;
  };

  // Supprimer un événement
  const removeEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  // Mettre à jour un événement
  const updateEvent = (eventId: string, updatedData: Partial<CalendarEvent>) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId ? { ...event, ...updatedData } : event
      )
    );
  };

  // Filtrer les événements par date
  const getEventsByDate = (date: Date) => {
    return events.filter(event => 
      format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  // Filtrer les événements par période
  const getEventsByDateRange = (startDate: Date, endDate: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startDate && eventDate <= endDate;
    });
  };

  // Récupérer les événements de la semaine sélectionnée
  const selectedWeekEvents = getEventsByDateRange(weekDays[0], weekDays[6]);

  // Récupérer les événements du jour sélectionné
  const selectedDateEvents = getEventsByDate(selectedDate);

  return {
    currentDate,
    selectedDate,
    setSelectedDate,
    events,
    setEvents,
    isLoading,
    goToPreviousMonth,
    goToNextMonth,
    addEvent,
    removeEvent,
    updateEvent,
    getEventsByDate,
    getEventsByDateRange,
    weekDays,
    selectedWeekEvents,
    selectedDateEvents
  };
};
