export default function CartItemRow({ item, onIncrement, onDecrement }) {
  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <div className="cart-item-name">{item.name}</div>
        <div className="cart-item-sub">{item.type}</div>
      </div>
      <div className="qty-stepper">
        <button onClick={() => onDecrement(item.id)}>–</button>
        <span className="qty-val">{item.qty}</span>
        <button onClick={() => onIncrement(item.id)}>+</button>
      </div>
      <div className="cart-item-price">{(item.price * item.qty).toLocaleString('en-LK')}</div>
    </div>
  );
}