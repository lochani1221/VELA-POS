import { Fragment } from 'react';
import PageHeader from '../components/PageHeader';
import CalendarToolbar from '../components/CalendarToolbar';
import StatusLegend from '../components/StatusLegend';
import AppointmentBlock from '../components/AppointmentBlock';
import CalendarViewSwitcher from '../components/CalendarViewSwitcher';
import { WEEK_DAYS, WEEKLY_SCHEDULE } from '../data/appointments';

export default function AppointmentsWeekly() {
  function handleNewBooking() {
    console.log('New booking');
  }
  function handlePrevWeek() {
    console.log('Go to previous week');
  }
  function handleNextWeek() {
    console.log('Go to next week');
  }

  return (
    <>
      <PageHeader eyebrow="Appointments" title="Weekly Schedule">
        <CalendarViewSwitcher />
        <button className="btn btn-primary" onClick={handleNewBooking}>+ New Booking</button>
      </PageHeader>

      <CalendarToolbar label="24 – 30 August 2026" onPrev={handlePrevWeek} onNext={handleNextWeek}>
        <StatusLegend />
      </CalendarToolbar>

    <div className="calendar-scroll">
      <div className="week-grid">
        <div className="col-head"></div>
        {WEEK_DAYS.map((day) => (
          <div className="col-head" key={day}>{day}</div>
        ))}
        {WEEKLY_SCHEDULE.map((row) => (
          <Fragment key={row.time}>
            <div className="time-cell">{row.time}</div>
            {row.slots.map((appt, i) => (
              <div className="slot-cell" key={i}>
                <AppointmentBlock appt={appt} />
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>  
    </>
  );
}