export const INVENTORY_STATS = {
  totalStockValue: 'Rs. 2.4M',
  lowStockAlerts: 5,
  damagedItems: 3,
  expiredProducts: 1,
};

export const LOW_STOCK_ALERTS = [
  { id: 1, product: 'Argan Hair Oil 100ml', currentStock: 4, reorderLevel: 10, branch: 'Colombo', tone: 'warn' },
  { id: 2, product: 'Rose Nail Polish', currentStock: 2, reorderLevel: 15, branch: 'Colombo', tone: 'bad' },
  { id: 3, product: 'Amber Perfume 50ml', currentStock: 9, reorderLevel: 12, branch: 'Kandy', tone: 'warn' },
];

export const DAMAGED_EXPIRED = [
  { id: 1, product: 'Gel Nail Polish Set', batch: 'BATCH-2026-05', reason: 'Damaged', qty: 2, date: '18 Aug 2026' },
  { id: 2, product: 'Facial Cleanser 200ml', batch: 'BATCH-2025-11', reason: 'Expired', qty: 1, date: '22 Aug 2026' },
];