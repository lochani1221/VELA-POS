export default function BranchComparisonChart({ branches }) {
  return (
    <div className="branch-compare">
      {branches.map((branch) => (
        <div className="branch-col" key={branch.name}>
          <div className="branch-bars">
            <div className="b b1" style={{ height: `${branch.revenueHeight}px` }} />
            <div className="b b2" style={{ height: `${branch.bookingsHeight}px` }} />
          </div>
          <div className="branch-name">{branch.name}</div>
        </div>
      ))}
    </div>
  );
}