import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Pill from '../components/Pill';
import Tag from '../components/Tag';
import { fetchStaffById, createStaff, updateStaff } from '../api/staffApi';
import { STAFF_ROLES, BRANCHES, STAFF_STATUSES, blankStaff } from '../data/staff';

const STATUS_TONE = { Active: 'good', 'On Leave': 'warn', Inactive: 'bad' };

export default function StaffDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [staff, setStaff] = useState(null);
  const [form, setForm] = useState(isNew ? blankStaff() : null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isNew) return;

    setLoading(true);
    fetchStaffById(id)
      .then((data) => {
        setStaff(data);
        if (data) {
          setForm({
            name: data.name,
            role: data.role,
            branch: data.branch,
            contact: data.contact,
            email: data.email || '',
            status: data.status,
            servicesAssigned: data.servicesAssigned || [],
          });
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function removeService(serviceToRemove) {
    setForm((prev) => ({
      ...prev,
      servicesAssigned: prev.servicesAssigned.filter((s) => s !== serviceToRemove),
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (isNew) {
        await createStaff(form);
      } else {
        await updateStaff(id, form);
      }
      navigate('/staff');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <PageHeader eyebrow="Staff Management" title="Loading..." />
        <p style={{ color: 'var(--ink-soft)' }}>Loading staff member...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader eyebrow="Staff Management" title="Error" />
        <div className="panel">
          <p style={{ color: 'var(--bad)' }}>Failed to load: {error}</p>
        </div>
      </>
    );
  }

  if (!isNew && (!staff || !form)) {
    return (
      <>
        <PageHeader eyebrow="Staff Management" title="Staff Not Found" />
        <div className="panel">
          <p style={{ color: 'var(--ink-soft)' }}>
            No staff member matches this ID.{' '}
            <button className="btn btn-ghost" onClick={() => navigate('/staff')}>
              Back to Directory
            </button>
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={isNew ? 'Staff Management' : `Staff  /  ${form.role}`}
        title={isNew ? 'Add Staff' : form.name}
      >
        <button className="btn btn-ghost" onClick={() => navigate('/staff')}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : isNew ? 'Add Staff' : 'Save Changes'}
        </button>
      </PageHeader>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 340px', alignItems: 'start' }}>
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Staff Details</div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Full Name</label>
              <input
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g. Anushka Wickramasinghe"
              />
            </div>

            <div className="field">
              <label>Role</label>
              <select value={form.role} onChange={(e) => updateField('role', e.target.value)}>
                {STAFF_ROLES.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Branch</label>
              <select value={form.branch} onChange={(e) => updateField('branch', e.target.value)}>
                {BRANCHES.map((branch) => (
                  <option key={branch}>{branch}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={(e) => updateField('status', e.target.value)}>
                {STAFF_STATUSES.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Contact Number</label>
              <input
                value={form.contact}
                onChange={(e) => updateField('contact', e.target.value)}
                placeholder="e.g. 071 222 3344"
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="e.g. name@vela.lk"
              />
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="field">
              <label>Services Assigned</label>
            </div>
            {form.servicesAssigned.length === 0 && (
              <p style={{ color: 'var(--ink-soft)', fontSize: 12.5, margin: '4px 0' }}>
                No services assigned yet.
              </p>
            )}
            {form.servicesAssigned.map((service) => (
              <Tag key={service} onRemove={() => removeService(service)}>
                {service}
              </Tag>
            ))}
            <Tag>+ Add Service</Tag>
          </div>
        </div>

        <div>
          {!isNew && staff && (
            <>
              <div className="panel" style={{ marginBottom: 18 }}>
                <div className="panel-head">
                  <div className="panel-title">Performance</div>
                </div>
                <div className="kpi-label">Bookings this month</div>
                <div className="kpi-value">{staff.bookingsThisMonth ?? '—'}</div>
                {staff.revenueGenerated && (
                  <div className="list-row" style={{ marginTop: 10 }}>
                    <div className="list-left">
                      <div className="list-sub">Revenue Generated</div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--aubergine-800)' }}>
                      Rs. {staff.revenueGenerated.toLocaleString('en-LK')}
                    </div>
                  </div>
                )}
                {staff.revenueTrend && (
                  <div className={staff.revenueTrend.startsWith('+') ? 'kpi-sub up' : 'kpi-sub down'}>
                    {staff.revenueTrend}
                  </div>
                )}
              </div>

              <div className="panel" style={{ marginBottom: 18 }}>
                <div className="panel-head">
                  <div className="panel-title">Status</div>
                </div>
                <div className="list-row">
                  <div className="list-left">
                    <div className="list-sub">Current Status</div>
                  </div>
                  <Pill tone={STATUS_TONE[staff.status] || 'neutral'}>{staff.status}</Pill>
                </div>
                <div className="list-row">
                  <div className="list-left">
                    <div className="list-sub">Rating</div>
                  </div>
                  <span>{staff.rating} ★</span>
                </div>
                <div className="list-row">
                  <div className="list-left">
                    <div className="list-sub">Joined</div>
                  </div>
                  <span>{staff.joinDate}</span>
                </div>
              </div>
            </>
          )}

          {isNew && (
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">Note</div>
              </div>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12.5 }}>
                Performance stats and rating will appear here once this staff member has
                completed their first bookings.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}