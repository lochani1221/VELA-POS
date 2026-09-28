import { STATUS_CLASS } from '../data/appointments';


const VALID_NEXT_STATUSES = {
  pending: [
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'noshow', label: 'No Show' },
  ],
  confirmed: [
    { key: 'progress', label: 'In Progress' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'noshow', label: 'No Show' },
  ],
  progress: [
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'noshow', label: 'No Show' },
  ],
  completed: [],
  cancelled: [],
  noshow: [],
};

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  noshow: 'No Show',
};


export default function AppointmentBlock({ appt, onStatusChange }) {
  if (!appt) return null;

  const options = VALID_NEXT_STATUSES[appt.status] ?? [];

  function handleChange(e) {
    const newStatus = e.target.value;
    if (newStatus && newStatus !== appt.status) {
      onStatusChange?.(newStatus);
    }
  }

  return (
    <div className={`appt-block ${STATUS_CLASS[appt.status] || ''}`}>
      {appt.customer}
      {(appt.service || appt.staff) && (
        <div className="sub">{[appt.service, appt.staff].filter(Boolean).join(' · ')}</div>
      )}
      {onStatusChange && (
        options.length > 0 ? (
          <select
            value={appt.status}
            onChange={handleChange}
            onClick={(e) => e.stopPropagation()}
            style={{ marginTop: 4, fontSize: 11, width: '100%' }}
          >
            <option value={appt.status} disabled>{STATUS_LABELS[appt.status]}</option>
            {options.map((opt) => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <div style={{ marginTop: 4, fontSize: 11, color: 'var(--ink-soft)' }}>
            {STATUS_LABELS[appt.status]} (final)
          </div>
        )
      )}
    </div>
  );
}