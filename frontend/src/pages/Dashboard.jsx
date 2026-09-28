import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import BarList from '../components/BarList';
import BranchComparisonChart from '../components/BranchComparisonChart';
import { fetchDashboardData } from '../api/dashboardApi';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchDashboardData()
      .then((result) => setData(result))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader eyebrow="Loading..." title="Good morning, Owner" />
        <p style={{ color: 'var(--ink-soft)' }}>Loading dashboard...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader eyebrow="Error" title="Dashboard" />
        <div className="panel">
          <p style={{ color: 'var(--bad)' }}>Failed to load: {error}</p>
        </div>
      </>
    );
  }

  const {
    primaryKpis, operationalStats, profitSparklinePoints, branchComparison,
    bestSellingServices, bestSellingProducts, upcomingBookings, staffPerformanceWeek,
  } = data;

  return (
    <>
      <PageHeader eyebrow="Wednesday, 26 August 2026" title="Good morning, Owner">
        <div className="branch-select">📍 Colombo — Main Branch ▾</div>
        <div className="avatar">O</div>
      </PageHeader>

      <div className="section-label" style={{ marginTop: 0 }}>Today at a glance</div>
      <div className="grid-4">
        {primaryKpis.map((kpi) => (
          <div className="kpi-card" key={kpi.label}>
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value">{kpi.value}</div>
            <div className={`kpi-sub ${kpi.tone}`}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="section-label">Operational health</div>
      <div className="stat-row">
        {operationalStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="section-label">Performance trends</div>
      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Monthly Profit</div>
            <div className="panel-meta">Last 6 months</div>
          </div>
          <svg className="sparkline" viewBox="0 0 480 150" preserveAspectRatio="none">
            <polyline fill="none" stroke="#EDE3E1" strokeWidth="1" points="0,140 480,140" />
            <polyline fill="none" stroke="#C7A24B" strokeWidth="3" points={profitSparklinePoints} />
            <circle cx="480" cy="20" r="5" fill="#4E2B4F" />
          </svg>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Branch Comparison</div>
            <div className="panel-meta">Revenue · Bookings</div>
          </div>
          <BranchComparisonChart branches={branchComparison} />
        </div>
      </div>

      <div className="section-label">Rankings &amp; schedule</div>
      <div className="grid-3">
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Best Selling Services</div></div>
          <BarList rows={bestSellingServices} />
        </div>

        <div className="panel">
          <div className="panel-head"><div className="panel-title">Best Selling Products</div></div>
          <BarList rows={bestSellingProducts} />
        </div>

        <div className="panel">
          <div className="panel-head"><div className="panel-title">Upcoming Bookings</div></div>
          {upcomingBookings.map((booking) => (
            <div className="list-row" key={booking.title}>
              <div className="list-left">
                <div className="list-title">{booking.title}</div>
                <div className="list-sub">{booking.sub}</div>
              </div>
              <div className="list-time">{booking.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-label">Staff performance</div>
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">This week</div>
          <div className="panel-meta">Sorted by revenue generated</div>
        </div>
        {staffPerformanceWeek.map((staff) => (
          <div className="list-row" key={staff.title}>
            <div className="list-left">
              <div className="list-title">{staff.title}</div>
              <div className="list-sub">{staff.sub}</div>
            </div>
            <div className="progress-mini">
              <div style={{ width: `${staff.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}