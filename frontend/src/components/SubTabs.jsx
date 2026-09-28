import { NavLink } from 'react-router-dom';

export default function SubTabs({ items }) {
  return (
    <div className="tabs" style={{ flexWrap: 'wrap' }}>
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end
          className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
          style={{ textDecoration: 'none' }}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}