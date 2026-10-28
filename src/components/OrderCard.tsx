import { money, statusLabels, type Order } from "../types";
export function OrderCard({
  order,
  action,
}: {
  order: Order;
  action?: React.ReactNode;
}) {
  return (
    <article className="panel order-card">
      <div className="order-heading">
        <div>
          <b>Đơn hàng #{order.id}</b>
          <p className="muted">
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
        <span className={"badge " + order.status.toLowerCase()}>
          {statusLabels[order.status]}
        </span>
      </div>
      {order.items.map((i) => (
        <div className="order-line" key={i.productId}>
          <span>
            {i.name} × {i.quantity}
          </span>
          <b>{money(i.unitPrice * i.quantity)}</b>
        </div>
      ))}
      <p className="muted">
        {order.recipient} · {order.phone}
        <br />
        {order.address}
      </p>
      <div className="total">
        <span>Tổng tiền · COD</span>
        <strong>{money(order.total)}</strong>
      </div>
      {action}
    </article>
  );
}
