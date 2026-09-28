import { STATUS_LEGEND } from '../data/appointments';

export default function StatusLegend() {
  return (
    <div className="status-legend">
      {STATUS_LEGEND.map((item) => (
        <span key={item.label}>
          <span className="dot" style={{ background: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}