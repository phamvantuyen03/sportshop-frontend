import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminProducts } from "../../features/products/api";
import { getOrders } from "../../features/orders/api";
import { ErrorMessage, Loading } from "../../components/Feedback";
import { money, type Order, type Product } from "../../types";
export function DashboardPage() {
  const [data, setData] = useState<{
      products: Product[];
      orders: Order[];
    } | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    Promise.all([getAdminProducts(), getOrders(true)])
      .then(([products, orders]) => setData({ products, orders }))
      .catch((e) => setError(e.message));
  }, []);
  return (
    <>
      <div className="eyebrow">CỬA HÀNG CỦA BẠN</div>
      <h1>Tổng quan</h1>
      <p className="muted">
        Theo dõi sản phẩm và xử lý đơn hàng ở cùng một nơi.
      </p>
      <ErrorMessage message={error} />
      {!data && !error ? (
        <Loading />
      ) : (
        data && (
          <>
            <div className="stats">
              <article className="panel">
                <span>Sản phẩm đang bán</span>
                <strong>{data.products.filter((p) => p.active).length}</strong>
              </article>
              <article className="panel">
                <span>Đơn chờ xác nhận</span>
                <strong>
                  {data.orders.filter((o) => o.status === "PENDING").length}
                </strong>
              </article>
              <article className="panel">
                <span>Giá trị đơn hoàn thành</span>
                <strong>
                  {money(
                    data.orders
                      .filter((o) => o.status === "COMPLETED")
                      .reduce((s, o) => s + o.total, 0),
                  )}
                </strong>
              </article>
            </div>
            <div className="panel">
              <h2>Sẵn sàng cho ngày mới</h2>
              <p>
                Cập nhật tồn kho và xác nhận các đơn mới để khách hàng sớm nhận
                được sản phẩm.
              </p>
              <div className="button-row">
                <Link className="button" to="/admin/orders">
                  Xử lý đơn hàng ↗
                </Link>
                <Link className="button secondary" to="/admin/products">
                  Quản lý sản phẩm
                </Link>
              </div>
            </div>
          </>
        )
      )}
    </>
  );
}
