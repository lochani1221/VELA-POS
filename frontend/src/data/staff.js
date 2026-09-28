export const STAFF = [
  {
    id: 1, name: 'Anushka Wickramasinghe', initials: 'AW', role: 'Senior Hair Stylist',
    branch: 'Colombo', contact: '071 222 3344', email: 'anushka.w@vela.lk', rating: 4.9,
    status: 'Active', joinDate: '12 Jan 2023',
    servicesAssigned: ['Hair Cut', 'Hair Colour', 'Hair Treatment', 'Hair Straightening'],
    bookingsThisMonth: 32, revenueGenerated: 148000, revenueTrend: '+12% vs last month',
  },
  {
    id: 2, name: 'Kavindi Ranasinghe', initials: 'KR', role: 'Bridal Specialist',
    branch: 'Colombo', contact: '077 445 5566', email: 'kavindi.r@vela.lk', rating: 4.8,
    status: 'Active', joinDate: '03 Jun 2022',
    servicesAssigned: ['Hair Spa', 'Bridal Package'],
    bookingsThisMonth: 18, revenueGenerated: 121500, revenueTrend: '+6% vs last month',
  },
  {
    id: 3, name: 'Ishara Peiris', initials: 'IP', role: 'Aesthetician',
    branch: 'Kandy', contact: '076 998 1122', email: 'ishara.p@vela.lk', rating: 4.7,
    status: 'On Leave', joinDate: '20 Sep 2023',
    servicesAssigned: ['Facial', 'Skin Care', 'Acne Treatment'],
    bookingsThisMonth: 27, revenueGenerated: 96200, revenueTrend: '-4% vs last month',
  },
  {
    id: 4, name: 'Dulani Senanayake', initials: 'DS', role: 'Nail Technician',
    branch: 'Galle', contact: '070 334 7788', email: 'dulani.s@vela.lk', rating: 4.6,
    status: 'Active', joinDate: '15 Feb 2024',
    servicesAssigned: ['Manicure', 'Pedicure', 'Gel Nails'],
    bookingsThisMonth: 41, revenueGenerated: 71800, revenueTrend: '+9% vs last month',
  },
];

export const STAFF_ROLES = ['Beautician', 'Hair Stylist', 'Nail Technician', 'Therapist', 'Cashier', 'Receptionist', 'Manager'];
export const BRANCHES = ['Colombo', 'Kandy', 'Galle'];
export const STAFF_STATUSES = ['Active', 'On Leave', 'Inactive'];

export function getStaffById(id) {
  return STAFF.find((s) => String(s.id) === String(id));
}

export function blankStaff() {
  return { name: '', role: STAFF_ROLES[0], branch: BRANCHES[0], contact: '', email: '', status: 'Active', servicesAssigned: [] };
}