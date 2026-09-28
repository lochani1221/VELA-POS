export const POS_CATEGORIES = ['All', 'Hair Services', 'Nail Services', 'Spa', 'Aesthetic', 'Retail Products', 'Packages'];

export const POS_ITEMS = [
  { id: 'svc-1', name: 'Hair Cut', category: 'Hair Services', type: 'Service', meta: '30 min · Hair', price: 1500 },
  { id: 'svc-2', name: 'Hair Colour', category: 'Hair Services', type: 'Service', meta: '120 min · Hair', price: 8500 },
  { id: 'svc-3', name: 'Hair Spa', category: 'Hair Services', type: 'Service', meta: '75 min · Hair', price: 5000 },
  { id: 'svc-4', name: 'Manicure', category: 'Nail Services', type: 'Service', meta: '40 min · Nail', price: 2000 },
  { id: 'svc-5', name: 'Pedicure', category: 'Nail Services', type: 'Service', meta: '45 min · Nail', price: 2500 },
  { id: 'svc-6', name: 'Gel Nails', category: 'Nail Services', type: 'Service', meta: '50 min · Nail', price: 3200 },
  { id: 'svc-7', name: 'Facial', category: 'Spa', type: 'Service', meta: '45 min · Spa', price: 3800 },
  { id: 'svc-8', name: 'Massage', category: 'Spa', type: 'Service', meta: '60 min · Spa', price: 4500 },
  { id: 'svc-9', name: 'Laser', category: 'Aesthetic', type: 'Service', meta: '30 min · Aesthetic', price: 9000 },
  { id: 'prod-1', name: 'Argan Hair Oil', category: 'Retail Products', type: 'Retail Product', meta: 'Retail · 4 left', price: 3200, lowStock: true },
  { id: 'prod-2', name: 'Vitamin C Serum', category: 'Retail Products', type: 'Retail Product', meta: 'Retail Product', price: 4800 },
  { id: 'prod-3', name: 'Keratin Shampoo', category: 'Retail Products', type: 'Retail Product', meta: 'Retail Product', price: 2900 },
  { id: 'pkg-1', name: 'Bridal Package', category: 'Packages', type: 'Package', meta: 'Facial+Hair+Makeup+Nails', price: 22000 },
];

export function getPosItemById(id) {
  return POS_ITEMS.find((item) => item.id === id);
}