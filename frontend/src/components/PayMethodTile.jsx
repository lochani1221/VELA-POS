export default function PayMethodTile({ icon, label, selected, onClick }) {
  return (
    <div className={selected ? 'pay-tile selected' : 'pay-tile'} onClick={onClick}>
      <div className="icon">{icon}</div>
      <div className="label">{label}</div>
    </div>
  );
}