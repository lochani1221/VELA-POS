export default function Tag({ children, onRemove }) {
  return (
    <span className="tag">
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          style={{
            marginLeft: 6,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: 'var(--aubergine-800)',
            fontWeight: 700,
            padding: 0,
          }}
          aria-label={`Remove ${children}`}
        >
          ×
        </button>
      )}
    </span>
  );
}