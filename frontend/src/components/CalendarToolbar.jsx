export default function CalendarToolbar({ label, onPrev, onNext, children }) {
  return (
    <div className="cal-toolbar">
      <div className="cal-nav">
        <span className="arrow" onClick={onPrev}>‹</span>
        <span className="label">{label}</span>
        <span className="arrow" onClick={onNext}>›</span>
      </div>
      {children}
    </div>
  );
}