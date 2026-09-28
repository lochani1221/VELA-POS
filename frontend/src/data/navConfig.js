// Single source of truth for sidebar navigation.
// Add new modules here as you build them - Sidebar.jsx renders from this.
export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', path: '/' }],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Customers (CRM)', path: '/customers' },
      { label: 'Appointments', path: '/appointments' },
      { label: 'Staff', path: '/staff' },
      { label: 'Services', path: '/services' },
      { label: 'Billing / POS', path: '/billing' },
      { label: 'Products', path: '/products' },
      { label: 'Inventory', path: '/inventory' },
      { label: 'Suppliers', path: '/suppliers' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { label: 'Loyalty', path: '/loyalty' },
      { label: 'Gift Vouchers', path: '/gift-vouchers' },
      { label: 'Promotions', path: '/promotions' },
      { label: 'Packages', path: '/packages' },
    ],
  },
  {
    label: 'Store Modules',
    items: [
      { label: 'Retail / Cosmetic', path: '/retail' },
      { label: 'Perfumery', path: '/perfumery' },
      { label: 'Beauty Supply', path: '/wholesale' },
      { label: 'Aesthetic Center', path: '/aesthetic' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Reports', path: '/reports' },
      { label: 'Branches', path: '/branches' },
      { label: 'Notifications', path: '/notifications' },
      { label: 'AI Assistant', path: '/ai-assistant' },
    ],
  },
  {
    label: 'System',
    items: [{ label: 'Admin Settings', path: '/admin' }],
  },
];
