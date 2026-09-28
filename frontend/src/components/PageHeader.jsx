export default function PageHeader({ eyebrow, title, children }) {
  return (
    <div className="topbar">
      <div>
        <div className="greeting-eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
      </div>
      {children && <div className="topbar-right">{children}</div>}
    </div>
  );
}
