import { useEffect, useState } from "react";
import { getOrders, changeStatus } from "../../features/orders/api";
import { OrderCard } from "../../components/OrderCard";
import { ErrorMessage, Loading } from "../../components/Feedback";
import { statusLabels, type Order } from "../../types";
const transitions: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPING", "CANCELLED"],
  SHIPPING: ["COMPLETED"],
};
export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [filter, setFilter] = useState("ALL");
  useEffect(() => {
    getOrders(true)
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  async function update(id: number, status: string) {
    if (
      status === "CANCELLED" &&
      !window.confirm("Hủy đơn và hoàn lại tồn kho?")
    )
      return;
    setBusy(true);
    setError("");
    try {
      const updated = await changeStatus(id, status);
      setOrders(orders.map((o) => (o.id === id ? updated : o)));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="eyebrow">VẬN HÀNH CỬA HÀNG</div>
      <h1>Đơn hàng</h1>
      <div className="chips order-filters">
        {["ALL", ...Object.keys(statusLabels)].map((s) => (
          <button
            key={s}
            className={filter === s ? "selected" : ""}
            onClick={() => setFilter(s)}
          >
            {statusLabels[s] || "Tất cả"}
          </button>
        ))}
      </div>
      <ErrorMessage message={error} />
      {loading ? (
        <Loading />
      ) : (
        orders
          .filter((o) => filter === "ALL" || filter === o.status)
          .map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              action={
                <div className="button-row">
                  {(transitions[o.status] || []).map((s) => (
                    <button
                      className={
                        "button " + (s === "CANCELLED" ? "secondary" : "")
                      }
                      disabled={busy}
                      key={s}
                      onClick={() => update(o.id, s)}
                    >
                      {statusLabels[s]}
                    </button>
                  ))}
                </div>
              }
            />
          ))
      )}
      {!loading &&
        !orders.filter((o) => filter === "ALL" || filter === o.status)
          .length && (
          <div className="empty">Chưa có đơn hàng ở trạng thái này.</div>
        )}
    </>
  );
}
