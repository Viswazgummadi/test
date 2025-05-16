// src/features/schedule/components/EventForm.tsx
import React, { useState, useEffect } from "react";
import type { CalendarEvent } from "../../../types/event";
import "./EventForm.css"; // Create this

interface EventFormProps {
  onSave: (event: Omit<CalendarEvent, "id"> | CalendarEvent) => void;
  onCancel: () => void;
  existingEvent?: CalendarEvent | null;
  defaultStartDate?: Date;
  defaultEndDate?: Date;
}

// Helper to format Date to YYYY-MM-DDTHH:mm for datetime-local input
const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
const formatDateForDateInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const EventForm: React.FC<EventFormProps> = ({
  onSave,
  onCancel,
  existingEvent,
  defaultStartDate,
  defaultEndDate,
}) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState<string>(() =>
    formatDateForInput(defaultStartDate || existingEvent?.start || new Date())
  );
  const [end, setEnd] = useState<string>(() =>
    // For new events from slot, default end might be same as start for day view, or an hour later
    formatDateForInput(
      defaultEndDate ||
        existingEvent?.end ||
        new Date(new Date().getTime() + 60 * 60 * 1000)
    )
  );
  const [allDay, setAllDay] = useState(existingEvent?.allDay || false);
  const [description, setDescription] = useState(
    existingEvent?.description || ""
  );
  const [color, setColor] = useState(existingEvent?.color || "#3174ad"); // Default RBC blue

  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title);
      setStart(formatDateForInput(new Date(existingEvent.start)));
      setEnd(formatDateForInput(new Date(existingEvent.end)));
      setAllDay(existingEvent.allDay || false);
      setDescription(existingEvent.description || "");
      setColor(existingEvent.color || "#3174ad");
    } else if (defaultStartDate) {
      // When clicking on a slot
      setTitle("");
      setStart(formatDateForInput(defaultStartDate));
      // Default end for slot click could be an hour later or same day depending on view
      const defaultEnd =
        defaultEndDate && defaultEndDate > defaultStartDate
          ? defaultEndDate
          : new Date(defaultStartDate.getTime() + 60 * 60 * 1000);
      setEnd(formatDateForInput(defaultEnd));
      setAllDay(false); // Or infer from slot (e.g., if whole day selected)
      setDescription("");
      setColor("#3174ad");
    }
  }, [existingEvent, defaultStartDate, defaultEndDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Event title is required.");
      return;
    }
    const startDate = new Date(start);
    let endDate = new Date(end);

    if (allDay) {
      // For all-day events, set time to beginning of start day and end of end day (or start day if single all-day)
      startDate.setHours(0, 0, 0, 0);
      // If end date string was just date, ensure it's end of that day
      if (end.length <= 10) {
        // YYYY-MM-DD
        endDate = new Date(end); // Parse just the date part
        endDate.setHours(23, 59, 59, 999);
      } else {
        // Has time, use it but ensure it's at least end of start day
        if (endDate <= startDate)
          endDate = new Date(startDate.getTime() + (24 * 60 * 60 * 1000 - 1)); // End of start day
      }
    }

    if (endDate <= startDate && !allDay) {
      alert("End date/time must be after start date/time.");
      return;
    }

    const eventData = {
      title: title.trim(),
      start: startDate,
      end: endDate,
      allDay,
      description: description.trim(),
      color,
    };

    if (existingEvent) {
      onSave({ ...existingEvent, ...eventData });
    } else {
      onSave(eventData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <div className="form-group">
        <label htmlFor="eventTitle">Title:</label>
        <input
          type="text"
          id="eventTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group form-group-inline">
        <div>
          <label htmlFor="eventStart">Start:</label>
          <input
            type={allDay ? "date" : "datetime-local"}
            id="eventStart"
            value={allDay ? start.substring(0, 10) : start}
            onChange={(e) =>
              setStart(e.target.value + (allDay ? "T00:00" : ""))
            }
            required
          />
        </div>
        <div>
          <label htmlFor="eventEnd">End:</label>
          <input
            type={allDay ? "date" : "datetime-local"}
            id="eventEnd"
            value={allDay ? end.substring(0, 10) : end}
            onChange={(e) => setEnd(e.target.value + (allDay ? "T00:00" : ""))}
            required
          />
        </div>
      </div>

      <div className="form-group form-group-checkbox">
        <input
          type="checkbox"
          id="eventAllDay"
          checked={allDay}
          onChange={(e) => setAllDay(e.target.checked)}
        />
        <label htmlFor="eventAllDay">All day event</label>
      </div>

      <div className="form-group">
        <label htmlFor="eventDescription">Description (Optional):</label>
        <textarea
          id="eventDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="eventColor">Color:</label>
        <input
          type="color"
          id="eventColor"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="save-btn">
          {existingEvent ? "Save Changes" : "Add Event"}
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EventForm;
