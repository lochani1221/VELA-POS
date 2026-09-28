export const CUSTOMERS = [
  {
    id: 1, custId: 'CUST-00231', name: 'Dilrukshi Perera', initials: 'DP',
    mobile: '077 234 5678', email: 'dilrukshi.p@gmail.com', birthday: '14 March', gender: 'Female',
    address: '42 Galle Road, Colombo 04', skinType: 'Combination', hairType: 'Wavy, colour-treated',
    allergies: 'Fragrance-free products only',
    favouriteServices: ['Hair Colouring', 'Facial', 'Bridal Package'],
    notes: 'Prefers quiet chair away from window. Always offer chamomile tea.',
    membership: 'Platinum', loyaltyPoints: 1420, lastVisit: '2 days ago', preferredStaff: 'Anushka W.',
    lifetimeSpend: 486000, totalVisits: 47,
    visitHistory: [
      { title: 'Hair Colouring + Treatment', sub: 'with Anushka W. · 24 Aug 2026', status: 'Completed' },
      { title: 'Facial & Skin Consultation', sub: 'with Ishara P. · 02 Aug 2026', status: 'Completed' },
      { title: 'Manicure & Pedicure', sub: 'with Dulani S. · 19 Jul 2026', status: 'Completed' },
    ],
    purchaseHistory: [
      { item: 'Argan Hair Oil', type: 'Product', amount: 3200, date: '24 Aug 2026' },
      { item: 'Hair Colouring Service', type: 'Service', amount: 12500, date: '24 Aug 2026' },
      { item: 'Vitamin C Serum', type: 'Product', amount: 4800, date: '02 Aug 2026' },
    ],
  },
  {
    id: 2, custId: 'CUST-00189', name: 'Nadeesha Fernando', initials: 'NF',
    mobile: '071 890 1234', email: 'nadeesha.f@gmail.com', birthday: '—', gender: '—',
    address: '—', skinType: '—', hairType: '—', allergies: '—',
    favouriteServices: [], notes: '',
    membership: 'Gold', loyaltyPoints: 860, lastVisit: '1 week ago', preferredStaff: 'Kavindi R.',
    lifetimeSpend: 214000, totalVisits: 22, visitHistory: [], purchaseHistory: [],
  },
  {
    id: 3, custId: 'CUST-00456', name: 'Sahan Jayasuriya', initials: 'SJ',
    mobile: '076 555 9021', email: 'sahan.j@gmail.com', birthday: '—', gender: '—',
    address: '—', skinType: '—', hairType: '—', allergies: '—',
    favouriteServices: [], notes: '',
    membership: 'Silver', loyaltyPoints: 240, lastVisit: '3 weeks ago', preferredStaff: 'Ishara P.',
    lifetimeSpend: 68000, totalVisits: 9, visitHistory: [], purchaseHistory: [],
  },
  {
    id: 4, custId: 'CUST-00512', name: 'Tharushi Silva', initials: 'TS',
    mobile: '070 112 3344', email: 'tharushi.s@gmail.com', birthday: '—', gender: '—',
    address: '—', skinType: '—', hairType: '—', allergies: '—',
    favouriteServices: [], notes: '',
    membership: 'Bronze', loyaltyPoints: 65, lastVisit: '2 months ago', preferredStaff: 'Dulani S.',
    lifetimeSpend: 15000, totalVisits: 3, visitHistory: [], purchaseHistory: [],
  },
];

export const MEMBERSHIP_TIERS = ['Platinum', 'Gold', 'Silver', 'Bronze'];
export const GENDERS = ['Female', 'Male', 'Other'];

export const CUSTOMER_STATS = {
  totalCustomers: 1284,
  newThisMonth: 38,
  returningRate: 61,
  avgLoyaltyPoints: 312,
};

export function getCustomerById(id) {
  return CUSTOMERS.find((c) => String(c.id) === String(id));
}

export function blankCustomer() {
  return {
    name: '', mobile: '', email: '', birthday: '', gender: GENDERS[0],
    address: '', skinType: '', hairType: '', allergies: '',
    favouriteServices: [], notes: '', membership: 'Bronze',
  };
}