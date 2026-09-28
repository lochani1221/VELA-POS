export default function BarList({ rows }) {
  return (
    <div className="bar-list">
      {rows.map((row) => (
        <div className="bar-row" key={row.name}>
          <div className="bar-row-top">
            <span className="name">{row.name}</span>
            <span className="val">{row.value}</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${row.percent}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}