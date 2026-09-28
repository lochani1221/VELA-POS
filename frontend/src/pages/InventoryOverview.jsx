import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import SubTabs from '../components/SubTabs';
import Pill from '../components/Pill';
import { INVENTORY_STATS, LOW_STOCK_ALERTS, DAMAGED_EXPIRED } from '../data/inventory';
import { INVENTORY_TABS } from '../data/inventoryTabs';

export default function InventoryOverview() {
  const navigate = useNavigate();

  function handleStockAdjustment() {
    navigate('/inventory/adjustment');
  }

  function handleReorder(item) {
    navigate('/inventory/adjustment', { state: { productName: item.product } });
  }

  return (
    <>
      <PageHeader eyebrow="Inventory Management" title="Inventory Overview">
        <button className="btn btn-primary" onClick={handleStockAdjustment}>+ Stock Adjustment</button>
      </PageHeader>

      <SubTabs items={INVENTORY_TABS} />

      <div className="grid-4" style={{ marginBottom: 22 }}>
        <div className="kpi-card"><div className="kpi-label">Total Stock Value</div><div className="kpi-value">{INVENTORY_STATS.totalStockValue}</div></div>
        <div className="kpi-card"><div className="kpi-label">Low Stock Alerts</div><div className="kpi-value">{INVENTORY_STATS.lowStockAlerts}</div></div>
        <div className="kpi-card"><div className="kpi-label">Damaged Items</div><div className="kpi-value">{INVENTORY_STATS.damagedItems}</div></div>
        <div className="kpi-card"><div className="kpi-label">Expired Products</div><div className="kpi-value">{INVENTORY_STATS.expiredProducts}</div></div>
      </div>

      <div className="section-label">Low Stock Alerts</div>
      <div className="panel" style={{ marginBottom: 24 }}>
        <table className="data-table">
          <thead><tr><th>Product</th><th>Current Stock</th><th>Reorder Level</th><th>Branch</th><th></th></tr></thead>
          <tbody>
            {LOW_STOCK_ALERTS.map((item) => (
              <tr key={item.id}>
                <td className="row-name">{item.product}</td>
                <td><Pill tone={item.tone}>{item.currentStock}</Pill></td>
                <td>{item.reorderLevel}</td>
                <td>{item.branch}</td>
                <td><button className="btn btn-ghost" onClick={() => handleReorder(item)}>Reorder</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-label">Damaged &amp; Expired</div>
      <div className="panel">
        <table className="data-table">
          <thead><tr><th>Product</th><th>Batch</th><th>Reason</th><th>Qty</th><th>Date</th></tr></thead>
          <tbody>
            {DAMAGED_EXPIRED.map((item) => (
              <tr key={item.id}>
                <td className="row-name">{item.product}</td>
                <td>{item.batch}</td>
                <td><Pill tone="bad">{item.reason}</Pill></td>
                <td>{item.qty}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}