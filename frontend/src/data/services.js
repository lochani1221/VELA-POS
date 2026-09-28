// Mock data for now. Once the backend is ready, replace this with a fetch/axios
// call in ServiceCatalog.jsx (e.g. GET /api/services) and drop this file.

export const SERVICES = [
  { id: 1, name: 'Hair Cut', category: 'Hair', duration: '30 min', price: 1500, staff: ['Anushka', 'Kavindi'], room: 'Room 1', commission: 10 },
 {
  id: 2,
  name: 'Hair Colour',
  category: 'Hair',
  duration: '120 min',
  price: 8500,
  staff: ['Anushka'],
  room: 'Room 1',
  commission: 15,
  description:
    'Full head or root-touch-up colour service using premium ammonia-free dyes. Includes consultation, application, and gloss finish.',
  requiredProducts: ['Permanent Hair Colour', 'Developer 20 Vol', 'Bond Protector', 'Gloss Treatment'],
  bookingsThisMonth: 142,
  bookingsTrend: '+18% vs last month',
  active: true,
  onlineBooking: true,
  requiresConsultation: false,
},
  { id: 3, name: 'Hair Wash', category: 'Hair', duration: '15 min', price: 500, staff: ['Any Stylist'], room: 'Room 1', commission: 5 },
  { id: 4, name: 'Hair Treatment', category: 'Hair', duration: '60 min', price: 4200, staff: ['Anushka', 'Kavindi'], room: 'Room 1', commission: 12 },
  { id: 5, name: 'Hair Spa', category: 'Hair', duration: '75 min', price: 5000, staff: ['Kavindi'], room: 'Room 1', commission: 12 },
  { id: 6, name: 'Hair Straightening', category: 'Hair', duration: '150 min', price: 12000, staff: ['Anushka'], room: 'Room 1', commission: 18 },

  { id: 7, name: 'Manicure', category: 'Nail', duration: '40 min', price: 2000, staff: ['Dulani'], room: 'Room 3', commission: 10 },
  { id: 8, name: 'Pedicure', category: 'Nail', duration: '45 min', price: 2500, staff: ['Dulani'], room: 'Room 3', commission: 10 },
  { id: 9, name: 'Nail Art', category: 'Nail', duration: '30 min', price: 1800, staff: ['Dulani'], room: 'Room 3', commission: 15 },
  { id: 10, name: 'Gel Nails', category: 'Nail', duration: '50 min', price: 3200, staff: ['Dulani'], room: 'Room 3', commission: 12 },

  { id: 11, name: 'Massage', category: 'Spa', duration: '60 min', price: 4500, staff: ['Ishara'], room: 'Room 2', commission: 15 },
  { id: 12, name: 'Facial', category: 'Spa', duration: '45 min', price: 3800, staff: ['Ishara'], room: 'Room 2', commission: 12 },
  { id: 13, name: 'Body Treatment', category: 'Spa', duration: '90 min', price: 7500, staff: ['Ishara'], room: 'Room 2', commission: 15 },

  { id: 14, name: 'Laser', category: 'Aesthetic', duration: '30 min', price: 9000, staff: ['Dr. Priyanka'], room: 'Aesthetic Suite', commission: 20 },
  { id: 15, name: 'Skin Care', category: 'Aesthetic', duration: '45 min', price: 5500, staff: ['Ishara'], room: 'Room 2', commission: 12 },
  { id: 16, name: 'Botox', category: 'Aesthetic', duration: '30 min', price: 25000, staff: ['Dr. Priyanka'], room: 'Aesthetic Suite', commission: 22 },
  { id: 17, name: 'Acne Treatment', category: 'Aesthetic', duration: '40 min', price: 4800, staff: ['Ishara'], room: 'Room 2', commission: 12 },
];

export const SERVICE_CATEGORIES = ['Hair', 'Nail', 'Spa', 'Aesthetic'];


export const ROOMS = ['Room 1 — Hair', 'Room 2 — Facial/Spa', 'Room 3 — Nails', 'Aesthetic Suite'];



export function getServiceById(id) {
  return SERVICES.find((s) => String(s.id) === String(id));
}
