import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { createService } from '../api/servicesApi';
import { SERVICE_CATEGORIES } from '../data/services';

function blankServiceForm() {
  return {
    name: '',
    category: SERVICE_CATEGORIES[0],
    duration: '',
    price: '',
    commission: '',
  };
}

export default function ServiceForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(blankServiceForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      await createService(form);
      navigate('/services');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    navigate('/services');
  }

  return (
    <>
      <PageHeader eyebrow="Service Management" title="Add Service">
        <button className="btn btn-ghost" onClick={handleCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Add Service'}
        </button>
      </PageHeader>

      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">Service Details</div>
        </div>

        {error && (
          <p style={{ color: 'var(--bad)', marginBottom: 12 }}>Failed to save: {error}</p>
        )}

        <div className="form-grid">
          <div className="field">
            <label>Service Name</label>
            <input
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. Hair Colouring"
            />
          </div>

          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => updateField('category', e.target.value)}>
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
              onChange={(e) => updateField('duration', e.target.value)}
              placeholder="e.g. 60"
            />
          </div>

          <div className="field">
            <label>Price (Rs.)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => updateField('price', e.target.value)}
              placeholder="e.g. 4500"
            />
          </div>

          <div className="field">
            <label>Commission Rate (%)</label>
            <input
              type="number"
              value={form.commission}
              onChange={(e) => updateField('commission', e.target.value)}
              placeholder="e.g. 12"
            />
          </div>
        </div>
      </div>
    </>
  );
}