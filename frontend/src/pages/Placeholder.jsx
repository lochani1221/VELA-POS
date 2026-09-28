import PageHeader from '../components/PageHeader';

export default function Placeholder({ title }) {
  return (
    <>
      <PageHeader eyebrow="Coming Soon" title={title} />
      <div className="panel">
        <p style={{ color: 'var(--ink-soft)' }}>
          This module hasn't been built yet — check back once it's wired up.
        </p>
      </div>
    </>
  );
}
