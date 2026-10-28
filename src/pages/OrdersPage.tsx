import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getOrders } from "../features/orders/api";
import { OrderCard } from "../components/OrderCard";
import { ErrorMessage, Loading } from "../components/Feedback";
import type { Order } from "../types";
export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  const [params] = useSearchParams();
  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  return (
    <section className="page narrow">
      <div className="eyebrow">HÀNH TRÌNH MUA SẮM</div>
      <h1>Đơn hàng của bạn</h1>
      {params.has("placed") && (
        <div className="success" role="status">
          Đặt hàng thành công! Cửa hàng sẽ xác nhận đơn của bạn.
        </div>
      )}
      <ErrorMessage message={error} />
      {loading ? (
        <Loading />
      ) : (
        orders.map((o) => <OrderCard key={o.id} order={o} />)
      )}
      {!loading && !error && !orders.length && (
        <div className="empty">
          Bạn chưa có đơn hàng. <Link to="/">Mua sắm ngay →</Link>
        </div>
      )}
    </section>
  );
}
