import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import CustomerTable from '../components/CustomerTable';
import { fetchCustomers } from '../api/customersApi';
import { MEMBERSHIP_TIERS, CUSTOMER_STATS } from '../data/customers';
import { USE_MOCK } from '../api/client';

const TABS = ['All', ...MEMBERSHIP_TIERS];

export default function CustomerList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchCustomers()
      .then((data) => setCustomers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesTab = activeTab === 'All' || customer.membership === activeTab;
      const query = search.toLowerCase();
      const matchesSearch = customer.name.toLowerCase().includes(query) || customer.mobile.includes(query);
      return matchesTab && matchesSearch;
    });
  }, [customers, activeTab, search]);

 
  const stats = useMemo(() => {
    if (USE_MOCK) return CUSTOMER_STATS;

    const totalCustomers = customers.pageInfo?.totalElements ?? customers.length;

    const avgLoyaltyPoints = customers.length
      ? Math.round(customers.reduce((sum, c) => sum + (c.loyaltyPoints || 0), 0) / customers.length)
      : 0;

    return {
      totalCustomers,
      avgLoyaltyPoints,
      // Not available from the backend yet - needs a dedicated stats
     
      newThisMonth: null,
      returningRate: null,
    };
  }, [customers]);

  function handleAddCustomer() {
    navigate('/customers/new');
  }

  function handleView(customer) {
    navigate(`/customers/${customer.id}`);
  }

  return (
    <>
      <PageHeader eyebrow="Customer Management" title="Customers">
        <input
          className="search-input"
          placeholder="Search by name or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 240 }}
        />
        <button className="btn btn-primary" onClick={handleAddCustomer}>+ Add Customer</button>
      </PageHeader>

      <div className="grid-4" style={{ marginBottom: 26 }}>
        <div className="kpi-card">
          <div className="kpi-label">Total Customers</div>
          <div className="kpi-value">{stats.totalCustomers.toLocaleString('en-LK')}</div>
          {stats.newThisMonth != null ? (
            <div className="kpi-sub up">+{stats.newThisMonth} this month</div>
          ) : (
            <div className="kpi-sub flat">data not available yet</div>
          )}
        </div>
        <div className="kpi-card">
          <div className="kpi-label">New This Month</div>
          <div className="kpi-value">{stats.newThisMonth ?? '—'}</div>
          <div className="kpi-sub flat">{stats.newThisMonth != null ? 'walk-in + online' : 'needs backend support'}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Returning Rate</div>
          <div className="kpi-value">{stats.returningRate != null ? `${stats.returningRate}%` : '—'}</div>
          <div className="kpi-sub flat">{stats.returningRate != null ? '▲ 4% vs last month' : 'needs backend support'}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Avg. Loyalty Points</div>
          <div className="kpi-value">{stats.avgLoyaltyPoints}</div>
          <div className="kpi-sub flat">per active member</div>
        </div>
      </div>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">Customer Directory</div>
          <div className="panel-meta">{filteredCustomers.length} customers</div>
        </div>
        {loading && <p style={{ color: 'var(--ink-soft)' }}>Loading customers...</p>}
        {error && <p style={{ color: 'var(--bad)' }}>Failed to load: {error}</p>}
        {!loading && !error && <CustomerTable customers={filteredCustomers} onView={handleView} />}
      </div>
    </>
  );
}