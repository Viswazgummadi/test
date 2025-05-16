// src/pages/SchedulePage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import type { EventProps, SlotInfo } from "react-big-calendar";

import { format } from "date-fns";
import { parse } from "date-fns";
import { startOfWeek } from "date-fns";
import { getDay } from "date-fns";
import { enUS } from "date-fns/locale";

import type { CalendarEvent } from "../types/event";
import Modal from "../components/common/Modal";
import EventForm from "../features/schedule/components/EventForm"; // We'll create this
import EventDetails from "../features/schedule/components/EventDetails"; // We'll create this
import "./SchedulePage.css"; // For custom page styling

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }), // Week starts on Monday
  getDay,
  locales,
});

const SCHEDULE_EVENTS_STORAGE_KEY = "studentDash_scheduleEvents";

// Custom Event Component (optional, for custom rendering in the calendar grid)
const CustomEventComponent: React.FC<EventProps<CalendarEvent>> = ({
  event,
}) => {
  return (
    <div
      style={{
        backgroundColor: event.color || "#3174ad",
        borderRadius: "3px",
        padding: "2px 5px",
        color: "white",
        fontSize: "0.85em",
      }}
    >
      <strong>{event.title}</strong>
      {event.description && (
        <p style={{ margin: "2px 0 0", fontSize: "0.9em" }}>
          {event.description.substring(0, 20)}...
        </p>
      )}
    </div>
  );
};

const SchedulePage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const storedEvents = localStorage.getItem(SCHEDULE_EVENTS_STORAGE_KEY);
    if (storedEvents) {
      // Need to parse dates from strings back to Date objects
      return JSON.parse(storedEvents).map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
    }
    return [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null); // For creating new event from slot
  const [viewState, setViewState] = useState<"form" | "details" | null>(null);

  useEffect(() => {
    localStorage.setItem(SCHEDULE_EVENTS_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo);
    setSelectedEvent(null); // Ensure no event is selected for editing
    setViewState("form");
    setIsModalOpen(true);
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedSlot(null); // Clear slot if an event is clicked
    setViewState("details");
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
    setViewState(null);
  };

  const handleSaveEvent = (
    eventData: Omit<CalendarEvent, "id"> | CalendarEvent
  ) => {
    if ("id" in eventData && eventData.id) {
      // Editing
      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.id === eventData.id ? { ...ev, ...eventData } : ev
        )
      );
    } else {
      // Creating new
      const newEvent: CalendarEvent = {
        ...eventData,
        id: new Date().toISOString() + "_event" + Math.random(),
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    handleCloseModal();
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents((prevEvents) => prevEvents.filter((ev) => ev.id !== eventId));
      handleCloseModal();
    }
  };

  const handleEditEventFromDetails = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setViewState("form");
    // Modal is already open
  };

  // Prepare events for react-big-calendar, ensuring start and end are Date objects
  const calendarEvents = events.map((e) => ({
    ...e,
    start: new Date(e.start), // Ensure it's a Date object
    end: new Date(e.end), // Ensure it's a Date object
  }));

  return (
    <div className="schedule-page-container">
      <h1>Schedule & Events</h1>
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "calc(100vh - 200px)", minHeight: 500 }} // Adjust height as needed
          selectable // Allows clicking on empty slots
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          defaultView={Views.MONTH}
          popup // Shows more events if they overflow a cell
          components={{
            event: CustomEventComponent, // Optional custom rendering
          }}
          // eventPropGetter={(event, start, end, isSelected) => { // Optional: for dynamic styling
          //   let newStyle = {
          //     backgroundColor: event.color || "lightgrey",
          //     color: 'black',
          //     borderRadius: "0px",
          //     border: "none"
          //   };
          //   return { style: newStyle };
          // }}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          viewState === "form"
            ? selectedEvent
              ? "Edit Event"
              : "Add New Event"
            : "Event Details"
        }
      >
        {viewState === "form" && (
          <EventForm
            onSave={handleSaveEvent}
            onCancel={handleCloseModal}
            existingEvent={selectedEvent}
            defaultStartDate={selectedSlot?.start}
            defaultEndDate={selectedSlot?.end}
          />
        )}
        {viewState === "details" && selectedEvent && (
          <EventDetails
            event={selectedEvent}
            onEdit={() => handleEditEventFromDetails(selectedEvent)}
            onDelete={() => handleDeleteEvent(selectedEvent.id)}
            onClose={handleCloseModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default SchedulePage;
