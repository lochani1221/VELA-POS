const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '·', '0', '⌫'];

export default function Keypad({ onKeyPress, confirmLabel, onConfirm, confirmDisabled }) {
  return (
    <div className="keypad">
      {KEYS.map((key) => (
        <div key={key} className="key" onClick={() => onKeyPress(key)}>{key}</div>
      ))}
      <button className="key wide" onClick={onConfirm} disabled={confirmDisabled}>{confirmLabel}</button>
    </div>
  );
}