export default function MobileTopbar({ onMenuClick }) {
  return (
    <div className="mobile-topbar">
      <button className="hamburger-btn" onClick={onMenuClick} aria-label="Open menu">☰</button>
      <div className="mobile-brand">VE<span>LA</span></div>
    </div>
  );
}