import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import ProductTable from '../components/ProductTable';
import { fetchProducts } from '../api/productsApi';
import { PRODUCT_CATEGORIES, PRODUCT_STATS } from '../data/products';

const TABS = ['All', ...PRODUCT_CATEGORIES];

export default function ProductList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesTab = activeTab === 'All' || product.category === activeTab;
      const query = search.toLowerCase();
      const matchesSearch = product.name.toLowerCase().includes(query) || product.sku.toLowerCase().includes(query) || product.barcode.includes(query);
      return matchesTab && matchesSearch;
    });
  }, [products, activeTab, search]);

    function handleAddProduct() {
    navigate('/products/new');
  }

  function handleEdit(product) {
    navigate(`/products/${product.id}`);
  }

  return (
    <>
      <PageHeader eyebrow="Product Management" title="Products">
        <input
          className="search-input"
          placeholder="Search by name, SKU or barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 240 }}
        />
        <button className="btn btn-primary" onClick={handleAddProduct}>+ Add Product</button>
      </PageHeader>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="grid-4" style={{ marginBottom: 22 }}>
        <div className="kpi-card"><div className="kpi-label">Total Products</div><div className="kpi-value">{PRODUCT_STATS.totalProducts}</div></div>
        <div className="kpi-card"><div className="kpi-label">Low Stock</div><div className="kpi-value">{PRODUCT_STATS.lowStock}</div><div className="kpi-sub down">needs reorder</div></div>
        <div className="kpi-card"><div className="kpi-label">Expiring Soon</div><div className="kpi-value">{PRODUCT_STATS.expiringSoon}</div><div className="kpi-sub down">within 30 days</div></div>
        <div className="kpi-card"><div className="kpi-label">Inventory Value</div><div className="kpi-value">{PRODUCT_STATS.inventoryValue}</div></div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">Product Catalog</div>
          <div className="panel-meta">{filteredProducts.length} products</div>
        </div>
        {loading && <p style={{ color: 'var(--ink-soft)' }}>Loading products...</p>}
        {error && <p style={{ color: 'var(--bad)' }}>Failed to load: {error}</p>}
        {!loading && !error && <ProductTable products={filteredProducts} onEdit={handleEdit} />}
      </div>
    </>
  );
}