import Pill from './Pill';

const STATUS_TONE = { Active: 'good', 'On Leave': 'warn', Inactive: 'bad' };

export default function StaffTable({ staff, onView }) {
  return (
    <table className="data-table">
      <thead>
        <tr><th>Staff</th><th>Role</th><th>Branch</th><th>Contact</th><th>Rating</th><th>Status</th><th></th></tr>
      </thead>
      <tbody>
        {staff.map((person) => (
          <tr key={person.id}>
            <td><span className="avatar-sm">{person.initials}</span><span className="row-name">{person.name}</span></td>
            <td>{person.role}</td>
            <td>{person.branch}</td>
            <td>{person.contact}</td>
            <td>{person.rating} ★</td>
            <td><Pill tone={STATUS_TONE[person.status] || 'neutral'}>{person.status}</Pill></td>
            <td><button className="btn btn-ghost" onClick={() => onView(person)}>View</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}