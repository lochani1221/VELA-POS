import Pill from './Pill';

export default function StatCard({ icon, pillText, pillTone, value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span className="stat-icon">{icon}</span>
        <Pill tone={pillTone}>{pillText}</Pill>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}