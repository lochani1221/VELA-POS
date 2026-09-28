import { formatRs } from '../utils/format';

export default function ServiceTable({ services, onEdit }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Service</th>
          <th>Duration</th>
          <th>Price</th>
          <th>Assigned Staff</th>
          <th>Room</th>
          <th>Commission</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {services.map((service) => (
          <tr key={service.id}>
            <td className="row-name">{service.name}</td>
            <td>{service.duration}</td>
            <td>{formatRs(service.price)}</td>
            <td>{service.staff.join(', ')}</td>
            <td>{service.room}</td>
            <td>{service.commission}%</td>
            <td>
              <button className="btn btn-ghost" onClick={() => onEdit(service)}>
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
