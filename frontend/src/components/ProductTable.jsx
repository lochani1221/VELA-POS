import Pill from './Pill';
import { formatRs } from '../utils/format';

const STATUS_TONE = { 'In Stock': 'good', 'Low Stock': 'warn', 'Out of Stock': 'bad', Discontinued: 'neutral' };

export default function ProductTable({ products, onEdit }) {
  return (
    <table className="data-table">
      <thead>
        <tr><th>Product</th><th>SKU</th><th>Category</th><th>Stock Qty</th><th>Buying Price</th><th>Selling Price</th><th>Expiry</th><th>Status</th><th></th></tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td className="row-name">{product.name}</td>
            <td>{product.sku}</td>
            <td>{product.category}</td>
            <td>{product.stockQty}</td>
            <td>{formatRs(product.buyingPrice)}</td>
            <td>{formatRs(product.sellingPrice)}</td>
            <td>{product.expiry}</td>
            <td><Pill tone={STATUS_TONE[product.status] || 'neutral'}>{product.status}</Pill></td>
            <td><button className="btn btn-ghost" onClick={() => onEdit(product)}>Edit</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}