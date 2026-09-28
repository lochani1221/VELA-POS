import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Pill from '../components/Pill';
import Tag from '../components/Tag';
import { getServiceById, SERVICE_CATEGORIES, ROOMS } from '../data/services';
import { formatRs } from '../utils/format';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = getServiceById(id);

  // Controlled form state, seeded from the found service.
  // If the service isn't found (bad URL), we still render a friendly message below.
  const [form, setForm] = useState(() =>
    service
      ? {
          name: service.name,
          category: service.category,
          duration: parseInt(service.duration, 10) || 0,
          price: service.price,
          commission: service.commission,
          room: service.room,
          description: service.description || '',
          requiredProducts: service.requiredProducts || [],
          staff: service.staff || [],
        }
      : null
  );

  if (!service || !form) {
    return (
      <>
        <PageHeader eyebrow="Services" title="Service Not Found" />
        <div className="panel">
          <p style={{ color: 'var(--ink-soft)' }}>
            No service matches this ID.{' '}
            <button className="btn btn-ghost" onClick={() => navigate('/services')}>
              Back to Catalog
            </button>
          </p>
        </div>
      </>
    );
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function removeProduct(productToRemove) {
    setForm((prev) => ({
      ...prev,
      requiredProducts: prev.requiredProducts.filter((p) => p !== productToRemove),
    }));
  }

  function removeStaff(staffToRemove) {
    setForm((prev) => ({
      ...prev,
      staff: prev.staff.filter((s) => s !== staffToRemove),
    }));
  }

  function handleSave() {
    // Wire this to PUT /api/services/:id later
    console.log('Saving service:', { id: service.id, ...form });
    navigate('/services');
  }

  function handleDuplicate() {
    // Wire this to POST /api/services (with a "(Copy)" suffix) later
    console.log('Duplicating service:', service.id);
  }

  return (
    <>
      <PageHeader eyebrow={`Services  /  ${service.category}`} title={service.name}>
        <button className="btn btn-ghost" onClick={handleDuplicate}>
          Duplicate
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Save Changes
        </button>
      </PageHeader>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 340px', alignItems: 'start' }}>
        {/* LEFT: editable form */}
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Service Details</div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Service Name</label>
              <input
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </div>

            <div className="field">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
              >
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Duration (minutes)</label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => updateField('duration', Number(e.target.value))}
              />
            </div>

            <div className="field">
              <label>Price (Rs.)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => updateField('price', Number(e.target.value))}
              />
            </div>

            <div className="field">
              <label>Commission Rate (%)</label>
              <input
                type="number"
                value={form.commission}
                onChange={(e) => updateField('commission', Number(e.target.value))}
              />
            </div>

            <div className="field">
              <label>Room Needed</label>
              <select
                value={form.room}
                onChange={(e) => updateField('room', e.target.value)}
              >
                {ROOMS.map((room) => (
                  <option key={room}>{room}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field" style={{ marginTop: 16 }}>
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="field">
              <label>Required Products</label>
            </div>
            {form.requiredProducts.map((product) => (
              <Tag key={product} onRemove={() => removeProduct(product)}>
                {product}
              </Tag>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="field">
              <label>Assigned Staff</label>
            </div>
            {form.staff.map((person) => (
              <Tag key={person} onRemove={() => removeStaff(person)}>
                {person}
              </Tag>
            ))}
            <Tag>+ Add Staff</Tag>
          </div>
        </div>

        {/* RIGHT: read-only performance + status */}
        <div>
          <div className="panel" style={{ marginBottom: 18 }}>
            <div className="panel-head">
              <div className="panel-title">Performance</div>
            </div>
            <div className="kpi-label">Bookings this month</div>
            <div className="kpi-value">{service.bookingsThisMonth ?? '—'}</div>
            {service.bookingsTrend && (
              <div className="kpi-sub up">▲ {service.bookingsTrend}</div>
            )}
          </div>

          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">Status</div>
            </div>
            <div className="list-row">
              <div className="list-left">
                <div className="list-sub">Availability</div>
              </div>
              <Pill tone={service.active ? 'good' : 'bad'}>
                {service.active ? 'Active' : 'Inactive'}
              </Pill>
            </div>
            <div className="list-row">
              <div className="list-left">
                <div className="list-sub">Online Booking</div>
              </div>
              <Pill tone={service.onlineBooking ? 'good' : 'neutral'}>
                {service.onlineBooking ? 'Enabled' : 'Disabled'}
              </Pill>
            </div>
            <div className="list-row">
              <div className="list-left">
                <div className="list-sub">Requires Consultation</div>
              </div>
              <Pill tone="neutral">{service.requiresConsultation ? 'Yes' : 'No'}</Pill>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
