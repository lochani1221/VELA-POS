import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ChannelPills from '../components/ChannelPills';
import CalendarToolbar from '../components/CalendarToolbar';
import StatusLegend from '../components/StatusLegend';
import AppointmentBlock from '../components/AppointmentBlock';
import CalendarViewSwitcher from '../components/CalendarViewSwitcher';
import { fetchAppointmentsByDate, updateAppointmentStatus, toDateParam } from '../api/appointmentsApi';


const TIME_SLOTS = [
  { label: '9:00', hour: 9 },
  { label: '10:00', hour: 10 },
  { label: '11:00', hour: 11 },
  { label: '12:00', hour: 12 },
  { label: '1:00', hour: 13 },
  { label: '2:00', hour: 14 },
  { label: '3:00', hour: 15 },
];

function formatDayLabel(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function AppointmentsDaily() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchAppointmentsByDate(selectedDate)
      .then((data) => setAppointments(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedDate]);


  function getSlotAppointment(hour) {
    return appointments.find((a) => new Date(a.startTime).getHours() === hour) ?? null;
  }

  async function handleStatusChange(appointmentId, newStatus) {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      // Refresh the day's appointments so the change reflects immediately.
      const refreshed = await fetchAppointmentsByDate(selectedDate);
      setAppointments(refreshed);
    } catch (err) {
      alert(`Could not update status: ${err.response?.data?.message || err.message}`);
    }
  }

  function handleNewBooking() {
    navigate('/appointments/new');
  }

  function handlePrevDay() {
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() - 1);
      return next;
    });
  }

  function handleNextDay() {
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + 1);
      return next;
    });
  }

  return (
    <>
      <PageHeader eyebrow="Appointments" title="Daily Schedule">
        <CalendarViewSwitcher />
        <button className="btn btn-primary" onClick={handleNewBooking}>+ New Booking</button>
      </PageHeader>

      <ChannelPills />

      <div style={{ marginTop: 18 }}>
        <CalendarToolbar label={formatDayLabel(selectedDate)} onPrev={handlePrevDay} onNext={handleNextDay}>
          <StatusLegend />
        </CalendarToolbar>
      </div>

      {loading && <p style={{ color: 'var(--ink-soft)' }}>Loading appointments...</p>}
      {error && <p style={{ color: 'var(--bad)' }}>Failed to load: {error}</p>}

      {!loading && !error && (
        <div className="calendar-scroll">
          <div className="day-grid">
            <div className="col-head"></div>
            <div className="col-head">All Staff</div>
            {TIME_SLOTS.map((slot) => (
              <Fragment key={slot.label}>
                <div className="time-cell">{slot.label}</div>
                <div className="slot-cell">
                  <AppointmentBlock
                    appt={getSlotAppointment(slot.hour)}
                    onStatusChange={(newStatus) => {
                      const appt = getSlotAppointment(slot.hour);
                      if (appt) handleStatusChange(appt.id, newStatus);
                    }}
                  />
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </>
  );
}