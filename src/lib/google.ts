import { google } from 'googleapis';
import { CalendarSlot, CalendarEvent } from '@/types';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const getAuthUrl = (businessId: string) => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
    state: businessId,
  });
};

export const getTokens = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

export const setCredentials = (tokens: { access_token?: string; refresh_token?: string }) => {
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
};

export const getCalendarEvents = async (
  calendarId: string,
  timeMin: Date,
  timeMax: Date
): Promise<CalendarEvent[]> => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  const response = await calendar.events.list({
    calendarId,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  return response.data.items as CalendarEvent[] || [];
};

export const getAvailableSlots = async (
  calendarId: string,
  date: Date,
  slotDurationMinutes: number = 30
): Promise<CalendarSlot[]> => {
  const events = await getCalendarEvents(
    calendarId,
    new Date(date.setHours(0, 0, 0, 0)),
    new Date(date.setHours(23, 59, 59, 999))
  );

  const slots: CalendarSlot[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17;  // 5 PM
  
  let current = new Date(date);
  current.setHours(startHour, 0, 0, 0);
  
  const end = new Date(date);
  end.setHours(endHour, 0, 0, 0);

  while (current < end) {
    const slotEnd = new Date(current.getTime() + slotDurationMinutes * 60000);
    
    // Check if slot overlaps with any event
    const isAvailable = !events.some(event => {
      const eventStart = new Date(event.start?.dateTime || '');
      const eventEnd = new Date(event.end?.dateTime || '');
      return (current >= eventStart && current < eventEnd) ||
             (slotEnd > eventStart && slotEnd <= eventEnd);
    });

    slots.push({
      start: new Date(current),
      end: slotEnd,
      available: isAvailable,
    });

    current = slotEnd;
  }

  return slots;
};

export const createCalendarEvent = async (
  calendarId: string,
  event: {
    summary: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    attendees?: { email: string }[];
  }
): Promise<CalendarEvent> => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const response = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: event.summary,
      description: event.description,
      start: {
        dateTime: event.startTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: event.endTime.toISOString(),
        timeZone: 'UTC',
      },
      attendees: event.attendees,
      reminders: {
        useDefault: true,
      },
    },
  });

  return response.data as CalendarEvent;
};

export const deleteCalendarEvent = async (calendarId: string, eventId: string) => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  await calendar.events.delete({
    calendarId,
    eventId,
  });
};
