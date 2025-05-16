// src/features/schedule/components/EventDetails.tsx
import React from "react";
import type { CalendarEvent } from "../../../types/event";
import "./EventDetails.css";

interface EventDetailsProps {
  event: CalendarEvent;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  onEdit,
  onDelete,
  onClose,
}) => {
  const formatDateRange = (start: Date, end: Date, allDay?: boolean) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    if (!allDay) {
      options.hour = "2-digit";
      options.minute = "2-digit";
    }
    const startDateStr = new Date(start).toLocaleDateString(undefined, options);
    if (allDay && start.toDateString() === end.toDateString()) {
      return startDateStr; // Only show start date if single all-day event
    }
    const endDateStr = new Date(end).toLocaleDateString(undefined, options);

    // If start and end are on the same day (and not allDay or multi-day allDay)
    if (!allDay && start.toDateString() === end.toDateString()) {
      return `${new Date(start).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })} from ${new Date(start).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })} to ${new Date(end).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return `${startDateStr} - ${endDateStr}`;
  };

  return (
    <div className="event-details">
      <h3
        className="event-details-title"
        style={{ borderLeftColor: event.color || "#3174ad" }}
      >
        {event.title}
      </h3>
      <p className="event-details-time">
        <strong>When:</strong>{" "}
        {formatDateRange(event.start, event.end, event.allDay)}
        {event.allDay && <span className="all-day-badge">(All day)</span>}
      </p>
      {event.description && (
        <div className="event-details-description">
          <strong>Description:</strong>
          <p>{event.description}</p>
        </div>
      )}
      {/* You could add more details here like location, type, etc. */}
      <div className="event-details-actions">
        <button onClick={onEdit} className="edit-btn">
          Edit
        </button>
        <button onClick={onDelete} className="delete-btn">
          Delete
        </button>
        <button onClick={onClose} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default EventDetails;
