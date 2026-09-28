export const PRODUCT_CATEGORIES = ['Shampoo', 'Conditioner', 'Hair Oil', 'Cosmetics', 'Makeup', 'Nail Polish', 'Perfume', 'Equipment'];
export const SUPPLIERS = ['Ceylon Beauty Distributors', 'Lanka Cosmetics Ltd'];
export const PRODUCT_STATUSES = ['Low Stock', 'In Stock', 'Out of Stock', 'Discontinued'];

export const PRODUCT_STATS = {
  totalProducts: 216,
  lowStock: 5,
  expiringSoon: 3,
  inventoryValue: 'Rs. 2.4M',
};

export const PRODUCTS = [
  { id: 1, name: 'Argan Hair Oil 100ml', sku: 'SKU-1042', barcode: '8901234567890', category: 'Hair Oil', supplier: 'Ceylon Beauty Distributors', batchNumber: 'BATCH-2026-08-A', stockQty: 4, reorderLevel: 10, buyingPrice: 1800, sellingPrice: 3200, expiry: 'March 2027', status: 'Low Stock', salesThisMonth: { units: 89, amount: 284800 }, salesLastMonth: { units: 76, amount: 243200 } },
  { id: 2, name: 'Vitamin C Serum 30ml', sku: 'SKU-2091', barcode: '8901234567891', category: 'Cosmetics', supplier: 'Lanka Cosmetics Ltd', batchNumber: 'BATCH-2026-05-B', stockQty: 22, reorderLevel: 10, buyingPrice: 2600, sellingPrice: 4800, expiry: 'Nov 2026', status: 'In Stock', salesThisMonth: { units: 34, amount: 163200 }, salesLastMonth: { units: 29, amount: 139200 } },
  { id: 3, name: 'Keratin Shampoo 250ml', sku: 'SKU-1078', barcode: '8901234567892', category: 'Shampoo', supplier: 'Ceylon Beauty Distributors', batchNumber: 'BATCH-2026-07-C', stockQty: 31, reorderLevel: 15, buyingPrice: 1500, sellingPrice: 2900, expiry: 'Jan 2027', status: 'In Stock', salesThisMonth: { units: 61, amount: 176900 }, salesLastMonth: { units: 55, amount: 159500 } },
  { id: 4, name: 'Rose Nail Polish', sku: 'SKU-3312', barcode: '8901234567893', category: 'Nail Polish', supplier: 'Lanka Cosmetics Ltd', batchNumber: 'BATCH-2025-12-A', stockQty: 2, reorderLevel: 15, buyingPrice: 400, sellingPrice: 950, expiry: '—', status: 'Out of Stock', salesThisMonth: { units: 12, amount: 11400 }, salesLastMonth: { units: 20, amount: 19000 } },
  { id: 5, name: 'Amber Perfume 50ml', sku: 'SKU-4501', barcode: '8901234567894', category: 'Perfume', supplier: 'Lanka Cosmetics Ltd', batchNumber: 'BATCH-2026-03-D', stockQty: 9, reorderLevel: 12, buyingPrice: 3200, sellingPrice: 6500, expiry: 'Sep 2026', status: 'Low Stock', salesThisMonth: { units: 18, amount: 117000 }, salesLastMonth: { units: 15, amount: 97500 } },
  { id: 6, name: 'Professional Hair Dryer', sku: 'SKU-9001', barcode: '8901234567895', category: 'Equipment', supplier: 'Ceylon Beauty Distributors', batchNumber: '—', stockQty: 6, reorderLevel: 3, buyingPrice: 12000, sellingPrice: 18500, expiry: '—', status: 'In Stock', salesThisMonth: { units: 3, amount: 55500 }, salesLastMonth: { units: 2, amount: 37000 } },
];

export function getProductById(id) {
  return PRODUCTS.find((p) => String(p.id) === String(id));
}

export function blankProduct() {
  return {
    name: '',
    category: PRODUCT_CATEGORIES[0],
    barcode: '',
    sku: '',
    supplier: SUPPLIERS[0],
    batchNumber: '',
    buyingPrice: 0,
    sellingPrice: 0,
    stockQty: 0,
    reorderLevel: 0,
    expiry: '',
    status: 'In Stock',
  };
}