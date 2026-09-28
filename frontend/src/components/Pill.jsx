// tone: 'good' | 'warn' | 'bad' | 'neutral'
export default function Pill({ tone = 'neutral', children }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}
