import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Pill from '../components/Pill';
import Tag from '../components/Tag';
import { fetchCustomerById } from '../api/customersApi';
import { formatRs } from '../utils/format';

export default function CustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchCustomerById(id)
      .then((data) => setCustomer(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <PageHeader eyebrow="Customers" title="Loading..." />
        <p style={{ color: 'var(--ink-soft)' }}>Loading customer...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader eyebrow="Customers" title="Error" />
        <div className="panel">
          <p style={{ color: 'var(--bad)' }}>Failed to load: {error}</p>
        </div>
      </>
    );
  }

  if (!customer) {
    return (
      <>
        <PageHeader eyebrow="Customers" title="Customer Not Found" />
        <div className="panel">
          <p style={{ color: 'var(--ink-soft)' }}>
            No customer matches this ID.{' '}
            <button className="btn btn-ghost" onClick={() => navigate('/customers')}>
              Back to Directory
            </button>
          </p>
        </div>
      </>
    );
  }

  function handleEditProfile() {
    navigate(`/customers/${customer.id}/edit`);
  }

  function handleNewBooking() {
    console.log('New booking for:', customer.id);
  }

  return (
    <>
      <PageHeader eyebrow={`Customers  /  ${customer.custId}`} title={customer.name}>
        <button className="btn btn-ghost" onClick={handleEditProfile}>
          Edit Profile
        </button>
        <button className="btn btn-primary" onClick={handleNewBooking}>
          + New Booking
        </button>
      </PageHeader>

      <div className="grid-2" style={{ gridTemplateColumns: '340px 1fr', alignItems: 'start' }}>
        <div className="panel">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              marginBottom: 18,
            }}
          >
            <div className="avatar" style={{ width: 84, height: 84, fontSize: 28, marginBottom: 14 }}>
              {customer.initials}
            </div>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 20,
                fontWeight: 600,
                color: 'var(--aubergine-800)',
              }}
            >
              {customer.name}
            </div>
            <Pill tone="neutral">
              {customer.membership} Member &middot; {customer.loyaltyPoints.toLocaleString('en-LK')} pts
            </Pill>
          </div>

          <ProfileRow label="Mobile" value={customer.mobile} />
          <ProfileRow label="Email" value={customer.email} />
          <ProfileRow label="Birthday" value={customer.birthday} />
          <ProfileRow label="Gender" value={customer.gender} />
          <ProfileRow label="Address" value={customer.address} />
          <ProfileRow label="Skin Type" value={customer.skinType} />
          <ProfileRow label="Hair Type" value={customer.hairType} />
          <ProfileRow label="Allergies" value={customer.allergies} />

          <div style={{ marginTop: 14 }}>
            <div className="list-sub" style={{ marginBottom: 8 }}>
              Favourite Services
            </div>
            {customer.favouriteServices.length === 0 ? (
              <p style={{ color: 'var(--ink-soft)', fontSize: 12.5 }}>None recorded yet.</p>
            ) : (
              customer.favouriteServices.map((service) => <Tag key={service}>{service}</Tag>)
            )}
          </div>

          {customer.notes && (
            <div style={{ marginTop: 14 }}>
              <div className="list-sub" style={{ marginBottom: 8 }}>
                Notes
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{customer.notes}</div>
            </div>
          )}
        </div>

        <div>
          <div className="grid-3" style={{ marginBottom: 18 }}>
            <div className="kpi-card">
              <div className="kpi-label">Lifetime Spend</div>
              <div className="kpi-value">{formatRs(customer.lifetimeSpend)}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Total Visits</div>
              <div className="kpi-value">{customer.totalVisits}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Preferred Staff</div>
              <div className="kpi-value" style={{ fontSize: 18 }}>
                {customer.preferredStaff}
              </div>
            </div>
          </div>

          <div className="panel" style={{ marginBottom: 18 }}>
            <div className="panel-head">
              <div className="panel-title">Visit History</div>
            </div>
            {customer.visitHistory.length === 0 ? (
              <p style={{ color: 'var(--ink-soft)', fontSize: 12.5 }}>No visits recorded yet.</p>
            ) : (
              customer.visitHistory.map((visit, i) => (
                <div className="list-row" key={i}>
                  <div className="list-left">
                    <div className="list-title">{visit.title}</div>
                    <div className="list-sub">{visit.sub}</div>
                  </div>
                  <Pill tone="good">{visit.status}</Pill>
                </div>
              ))
            )}
          </div>

          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">Purchase History</div>
            </div>
            {customer.purchaseHistory.length === 0 ? (
              <p style={{ color: 'var(--ink-soft)', fontSize: 12.5 }}>No purchases recorded yet.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.purchaseHistory.map((purchase, i) => (
                    <tr key={i}>
                      <td className="row-name">{purchase.item}</td>
                      <td>{purchase.type}</td>
                      <td>{formatRs(purchase.amount)}</td>
                      <td>{purchase.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="list-row">
      <div className="list-left">
        <div className="list-sub">{label}</div>
        <div className="list-title">{value}</div>
      </div>
    </div>
  );
}