import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { fetchCustomers } from '../api/customersApi';
import { fetchStaff } from '../api/staffApi';
import { fetchServices } from '../api/servicesApi';
import { createAppointment } from '../api/appointmentsApi';

function blankBookingForm() {
  return { customerId: '', staffId: '', serviceId: '', startTime: '' };
}

export default function AppointmentForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState(blankBookingForm());
  const [customers, setCustomers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [services, setServices] = useState([]);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoadingOptions(true);
    Promise.all([fetchCustomers(), fetchStaff(), fetchServices()])
      .then(([customerList, staffList, serviceList]) => {
        setCustomers(customerList);
        setStaff(staffList);
        setServices(serviceList);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingOptions(false));
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.customerId || !form.staffId || !form.serviceId || !form.startTime) {
      setError('Please fill in customer, staff, service, and date/time.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
     
      const startTime = new Date(form.startTime).toISOString();

      await createAppointment({
        customerId: form.customerId,
        staffId: form.staffId,
        serviceId: form.serviceId,
        startTime,
      });
      navigate('/appointments');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    navigate('/appointments');
  }

  return (
    <>
      <PageHeader eyebrow="Appointments" title="New Booking">
        <button className="btn btn-ghost" onClick={handleCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving || loadingOptions}>
          {saving ? 'Saving...' : 'Create Booking'}
        </button>
      </PageHeader>

      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">Booking Details</div>
        </div>

        {error && (
          <p style={{ color: 'var(--bad)', marginBottom: 12 }}>{error}</p>
        )}

        {loadingOptions ? (
          <p style={{ color: 'var(--ink-soft)' }}>Loading customers, staff, and services...</p>
        ) : (
          <div className="form-grid">
            <div className="field">
              <label>Customer</label>
              <select value={form.customerId} onChange={(e) => updateField('customerId', e.target.value)}>
                <option value="">Select a customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Staff Member</label>
              <select value={form.staffId} onChange={(e) => updateField('staffId', e.target.value)}>
                <option value="">Select a staff member...</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Service</label>
              <select value={form.serviceId} onChange={(e) => updateField('serviceId', e.target.value)}>
                <option value="">Select a service...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.duration})</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Date &amp; Time</label>
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => updateField('startTime', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}