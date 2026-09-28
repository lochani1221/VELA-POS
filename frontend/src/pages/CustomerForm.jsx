import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Tag from '../components/Tag';
import { fetchCustomerById, createCustomer, updateCustomer } from '../api/customersApi';
import { MEMBERSHIP_TIERS, GENDERS, blankCustomer } from '../data/customers';

export default function CustomerForm() {
  const { id } = useParams(); // undefined on /customers/new, a real id on /customers/:id/edit
  const navigate = useNavigate();
  const isNew = !id;

  const [form, setForm] = useState(isNew ? blankCustomer() : null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isNew) return;

    setLoading(true);
    fetchCustomerById(id)
      .then((data) => {
        if (data) {
          setForm({
            name: data.name,
            mobile: data.mobile,
            email: data.email,
            birthday: data.birthday === '—' ? '' : data.birthday,
            gender: data.gender === '—' ? GENDERS[0] : data.gender,
            address: data.address === '—' ? '' : data.address,
            skinType: data.skinType === '—' ? '' : data.skinType,
            hairType: data.hairType === '—' ? '' : data.hairType,
            allergies: data.allergies === '—' ? '' : data.allergies,
            favouriteServices: data.favouriteServices || [],
            notes: data.notes || '',
            membership: data.membership,
          });
        } else {
          setForm(null);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function removeFavourite(serviceToRemove) {
    setForm((prev) => ({
      ...prev,
      favouriteServices: prev.favouriteServices.filter((s) => s !== serviceToRemove),
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (isNew) {
        const created = await createCustomer(form);
        navigate(`/customers/${created.id}`);
      } else {
        await updateCustomer(id, form);
        navigate(`/customers/${id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    navigate(isNew ? '/customers' : `/customers/${id}`);
  }

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

  if (!isNew && !form) {
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

  return (
    <>
      <PageHeader
        eyebrow="Customer Management"
        title={isNew ? 'Add Customer' : `Edit  /  ${form.name}`}
      >
        <button className="btn btn-ghost" onClick={handleCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : isNew ? 'Add Customer' : 'Save Changes'}
        </button>
      </PageHeader>

      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">Customer Details</div>
        </div>

        <div className="form-grid">
          <div className="field">
            <label>Full Name</label>
            <input
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. Dilrukshi Perera"
            />
          </div>

          <div className="field">
            <label>Mobile Number</label>
            <input
              value={form.mobile}
              onChange={(e) => updateField('mobile', e.target.value)}
              placeholder="e.g. 077 234 5678"
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="e.g. name@gmail.com"
            />
          </div>

          <div className="field">
            <label>Birthday</label>
            <input
              value={form.birthday}
              onChange={(e) => updateField('birthday', e.target.value)}
              placeholder="e.g. 14 March"
            />
          </div>

          <div className="field">
            <label>Gender</label>
            <select value={form.gender} onChange={(e) => updateField('gender', e.target.value)}>
              {GENDERS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Membership Level</label>
            <select value={form.membership} onChange={(e) => updateField('membership', e.target.value)}>
              {MEMBERSHIP_TIERS.map((tier) => (
                <option key={tier}>{tier}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Skin Type</label>
            <input
              value={form.skinType}
              onChange={(e) => updateField('skinType', e.target.value)}
              placeholder="e.g. Combination"
            />
          </div>

          <div className="field">
            <label>Hair Type</label>
            <input
              value={form.hairType}
              onChange={(e) => updateField('hairType', e.target.value)}
              placeholder="e.g. Wavy, colour-treated"
            />
          </div>
        </div>

        <div className="field" style={{ marginTop: 16 }}>
          <label>Address</label>
          <input
            value={form.address}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="e.g. 42 Galle Road, Colombo 04"
          />
        </div>

        <div className="field" style={{ marginTop: 16 }}>
          <label>Allergies</label>
          <input
            value={form.allergies}
            onChange={(e) => updateField('allergies', e.target.value)}
            placeholder="e.g. Fragrance-free products only"
          />
        </div>

        <div className="field" style={{ marginTop: 16 }}>
          <label>Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Any preferences staff should know about..."
          />
        </div>

        <div style={{ marginTop: 20 }}>
          <div className="field">
            <label>Favourite Services</label>
          </div>
          {form.favouriteServices.length === 0 && (
            <p style={{ color: 'var(--ink-soft)', fontSize: 12.5, margin: '4px 0' }}>
              None added yet.
            </p>
          )}
          {form.favouriteServices.map((service) => (
            <Tag key={service} onRemove={() => removeFavourite(service)}>
              {service}
            </Tag>
          ))}
          <Tag>+ Add Service</Tag>
        </div>
      </div>
    </>
  );
} 