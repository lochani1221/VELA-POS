import Pill from './Pill';

export default function CustomerTable({ customers, onView }) {
  return (
    <table className="data-table">
      <thead>
        <tr><th>Customer</th><th>Mobile</th><th>Membership</th><th>Loyalty Points</th><th>Last Visit</th><th>Preferred Staff</th><th></th></tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td>
              <span className="avatar-sm">{customer.initials}</span>
              <span className="row-name">{customer.name}</span>
              <br />
              <span className="row-sub" style={{ marginLeft: 44 }}>{customer.custId}</span>
            </td>
            <td>{customer.mobile}</td>
            <td><Pill tone="neutral">{customer.membership}</Pill></td>
            <td>{customer.loyaltyPoints.toLocaleString('en-LK')}</td>
            <td>{customer.lastVisit}</td>
            <td>{customer.preferredStaff}</td>
            <td><button className="btn btn-ghost" onClick={() => onView(customer)}>View</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}