import { formatRs } from '../utils/format';

export default function PosItemTile({ item, onAdd }) {
  return (
    <div className={`pos-tile${item.lowStock ? ' low-stock' : ''}`} onClick={() => onAdd(item)}>
      <div>
        <div className="name">{item.name}</div>
        <div className="meta">{item.meta}</div>
      </div>
      <div className="price">{formatRs(item.price)}</div>
    </div>
  );
}