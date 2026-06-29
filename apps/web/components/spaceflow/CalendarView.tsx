'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

type CalEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
};

export default function CalendarView({ events }: { events: CalEvent[] }) {
  return (
    <div className="fullcalendar-dark">
      <style>{`
        .fullcalendar-dark .fc {
          --fc-border-color: #1e293b;
          --fc-button-bg-color: #0F766E;
          --fc-button-border-color: transparent;
          --fc-button-hover-bg-color: #0d6460;
          --fc-button-active-bg-color: #0d9488;
          --fc-today-bg-color: rgba(15, 118, 110, 0.1);
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: #1e293b;
        }
        .fullcalendar-dark .fc-toolbar-title,
        .fullcalendar-dark .fc-col-header-cell,
        .fullcalendar-dark .fc-daygrid-day-number,
        .fullcalendar-dark .fc-timegrid-slot-label {
          color: #e2e8f0;
        }
        .fullcalendar-dark .fc-event {
          cursor: pointer;
          border-radius: 4px;
        }
      `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        buttonText={{
          today: "Aujourd'hui",
          month: 'Mois',
          week: 'Semaine',
          day: 'Jour',
        }}
        height="auto"
      />
    </div>
  );
}
