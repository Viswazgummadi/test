// src/types/event.ts
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date; // react-big-calendar expects Date objects
  end: Date; // react-big-calendar expects Date objects
  allDay?: boolean;
  description?: string;
  color?: string; // For custom event colors (optional)
  // You can add more custom properties here
  // location?: string;
  // type?: 'lecture' | 'study_session' | 'personal' | 'assignment_deadline';
}
