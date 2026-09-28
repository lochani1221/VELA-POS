import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import PageHeader from '../components/PageHeader';
import SubTabs from '../components/SubTabs';
import Pill from '../components/Pill';
import StaffTable from '../components/StaffTable';
import { fetchStaff } from '../api/staffApi';
import { STAFF_ROLES } from '../data/staff';
import { STAFF_TABS } from '../data/staffTabs';


export default function StaffList() {
    const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchStaff()
      .then((data) => setStaff(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

   function handleAddStaff() {
    navigate('/staff/new');
  }

  function handleView(person) {
    navigate(`/staff/${person.id}`);
  }

  return (
    <>
      <PageHeader eyebrow="Staff Management" title="Staff Directory">
        <button className="btn btn-primary" onClick={handleAddStaff}>+ Add Staff</button>
      </PageHeader>

      <SubTabs items={STAFF_TABS} />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {STAFF_ROLES.map((role) => (
          <Pill key={role} tone="neutral">{role}</Pill>
        ))}
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <div className="panel-head">
          <div className="panel-title">All Staff</div>
          <div className="panel-meta">{staff.length} employees</div>
        </div>
        {loading && <p style={{ color: 'var(--ink-soft)' }}>Loading staff...</p>}
        {error && <p style={{ color: 'var(--bad)' }}>Failed to load: {error}</p>}
        {!loading && !error && <StaffTable staff={staff} onView={handleView} />}
      </div>
    </>
  );
}