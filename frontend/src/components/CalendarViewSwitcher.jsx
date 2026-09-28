import { NavLink } from 'react-router-dom';

const VIEWS = [
  { label: 'Daily', path: '/appointments' },
  { label: 'Weekly', path: '/appointments/weekly' },
//   { label: 'Monthly', path: '/appointments/monthly' },
];

export default function CalendarViewSwitcher() {
  return (
    <>
      {VIEWS.map((view) => (
        <NavLink
          key={view.path}
          to={view.path}
          end
          className={({ isActive }) => (isActive ? 'btn btn-primary' : 'btn btn-ghost')}
          style={{ textDecoration: 'none' }}
        >
          {view.label}
        </NavLink>
      ))}
    </>
  );
}