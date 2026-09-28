export const STATUS_LEGEND = [
  { label: 'Pending', color: 'var(--warn)' },
  { label: 'Confirmed', color: 'var(--good)' },
  { label: 'In Progress', color: 'var(--gold)' },
  { label: 'Completed', color: 'var(--aubergine-700)' },
  { label: 'Cancelled', color: 'var(--bad)' },
  { label: 'No Show', color: '#8a8a8a' },
];

export const STATUS_CLASS = {
  confirmed: 'st-confirmed', pending: 'st-pending', progress: 'st-progress',
  completed: 'st-completed', cancelled: 'st-cancelled', noshow: 'st-noshow',
};

export const BOOKING_CHANNELS = ['Walk-in', 'Advance', 'Online', 'WhatsApp', 'Phone'];

export const DAILY_SCHEDULE = [
  { time: '9:00', appt: { customer: 'Dilrukshi Perera', service: 'Hair Colouring', staff: 'Anushka', status: 'confirmed' } },
  { time: '10:00', appt: { customer: 'Nadeesha Fernando', service: 'Bridal Trial', staff: 'Kavindi', status: 'pending' } },
  { time: '11:00', appt: { customer: 'Sahan Jayasuriya', service: 'Facial', staff: 'Ishara', status: 'progress' } },
  { time: '12:00', appt: { customer: 'Tharushi Silva', service: 'Manicure', staff: 'Dulani', status: 'completed' } },
  { time: '1:00', appt: null },
  { time: '2:00', appt: { customer: 'Ruwan De Silva', service: 'Hair Cut', staff: 'Anushka', status: 'cancelled' } },
  { time: '3:00', appt: { customer: 'Chamodi Rathnayake', service: 'Facial', staff: 'Ishara', status: 'noshow' } },
];

export const WEEK_DAYS = ['Mon 24', 'Tue 25', 'Wed 26', 'Thu 27', 'Fri 28', 'Sat 29', 'Sun 30'];

export const WEEKLY_SCHEDULE = [
  { time: '9:00', slots: [
    { customer: 'D.Perera', status: 'confirmed' }, null,
    { customer: 'N.Fernando', status: 'pending' }, null,
    { customer: 'R.Bandara', status: 'confirmed' }, null, null,
  ]},
  { time: '11:00', slots: [
    null, { customer: 'S.Jaya.', status: 'progress' }, null,
    { customer: 'M.Kumari', status: 'confirmed' }, null,
    { customer: 'T.Silva', status: 'completed' }, null,
  ]},
  { time: '2:00', slots: [
    { customer: 'R.DeSilva', status: 'cancelled' }, null,
    { customer: 'C.Rathnayake', status: 'noshow' }, null, null,
    { customer: 'A.Weeras.', status: 'confirmed' }, null,
  ]},
];