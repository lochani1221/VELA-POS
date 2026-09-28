import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import ServiceTable from '../components/ServiceTable';
import { SERVICE_CATEGORIES } from '../data/services';
import { fetchServices } from '../api/servicesApi';

const TABS = ['All', ...SERVICE_CATEGORIES];

export default function ServiceCatalog() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchServices()
      .then((data) => setServices(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesTab = activeTab === 'All' || service.category === activeTab;
      const matchesSearch = service.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [services, activeTab, search]);

  // Group the filtered list by category so each renders under its own section label
  const grouped = useMemo(() => {
    const groups = {};
    for (const service of filteredServices) {
      if (!groups[service.category]) groups[service.category] = [];
      groups[service.category].push(service);
    }
    return groups;
  }, [filteredServices]);

   function handleEdit(service) {
    navigate(`/services/${service.id}`);
  }

  function handleAddService() {
    navigate('/services/new');
  }

  return (
    <>
      <PageHeader eyebrow="Service Management" title="Service Catalog">
        <input
          className="search-input"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddService}>
          + Add Service
        </button>
      </PageHeader>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {loading && <p style={{ color: 'var(--ink-soft)' }}>Loading services...</p>}
      {error && <p style={{ color: 'var(--bad)' }}>Failed to load: {error}</p>}

      {!loading && !error && Object.keys(grouped).length === 0 && (
        <p style={{ color: 'var(--ink-soft)' }}>No services match your search.</p>
      )}

      {!loading && !error && Object.entries(grouped).map(([category, categoryServices]) => (
        <div key={category}>
          <div className="section-label">{category}</div>
          <div className="panel" style={{ marginBottom: 24 }}>
            <ServiceTable services={categoryServices} onEdit={handleEdit} />
          </div>
        </div>
      ))}
    </>
  );
}