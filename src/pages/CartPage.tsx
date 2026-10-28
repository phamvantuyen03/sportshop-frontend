import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "../features/cart/CartContext";
import { cartTotal } from "../features/cart/cart";
import { useAuth } from "../features/auth/AuthContext";
import { placeOrder } from "../features/orders/api";
import { ProductArt } from "../components/ProductArt";
import { ErrorMessage } from "../components/Feedback";
import { money } from "../types";
export function CartPage() {
  const { items, quantity, clear } = useCart();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const navigate = useNavigate();
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) {
      navigate("/login?next=/cart");
      return;
    }
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await placeOrder({
        recipient: String(f.get("recipient")),
        phone: String(f.get("phone")),
        address: String(f.get("address")),
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      });
      clear();
      navigate("/orders?placed=1");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="page">
      <div className="eyebrow">BƯỚC TIẾP THEO CỦA BẠN</div>
      <h1>Giỏ hàng</h1>
      {!items.length ? (
        <div className="empty">
          Giỏ hàng đang trống.
          <br />
          <Link className="button" to="/">
            Khám phá sản phẩm ↗
          </Link>
        </div>
      ) : (
        <div className="checkout">
          <div>
            {items.map((i) => (
              <div className="cart-row" key={i.product.id}>
                <ProductArt
                  category={i.product.category}
                  name={i.product.name}
                />
                <div>
                  <Link to={"/products/" + i.product.id}>
                    <h3>{i.product.name}</h3>
                  </Link>
                  <p>{money(i.product.price)}</p>
                  <label>
                    Số lượng
                    <input
                      type="number"
                      aria-label={"Số lượng " + i.product.name}
                      min={1}
                      max={Math.min(99, i.product.stock)}
                      value={i.quantity}
                      disabled={busy}
                      onChange={(e) =>
                        quantity(i.product.id, Number(e.target.value))
                      }
                    />
                  </label>
                </div>
                <button
                  className="icon-button"
                  aria-label={"Xóa " + i.product.name}
                  disabled={busy}
                  onClick={() => quantity(i.product.id, 0)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <form className="panel" onSubmit={submit}>
            <h2>Thông tin nhận hàng</h2>
            <ErrorMessage message={error} />
            <label>
              Người nhận
              <input
                name="recipient"
                required
                maxLength={100}
                autoComplete="name"
                defaultValue={user?.name}
              />
            </label>
            <label>
              Số điện thoại
              <input
                name="phone"
                type="tel"
                required
                minLength={8}
                maxLength={20}
                autoComplete="tel"
              />
            </label>
            <label>
              Địa chỉ giao hàng
              <textarea
                name="address"
                required
                maxLength={500}
                autoComplete="street-address"
              />
            </label>
            <div className="total">
              <span>Tổng tiền sản phẩm</span>
              <strong>{money(cartTotal(items))}</strong>
            </div>
            <p className="muted">
              Thanh toán khi nhận hàng (COD). Bản khởi đầu chưa tính phí giao
              hàng; giá và tồn kho được kiểm tra lại khi đặt.
            </p>
            {user ? (
              <button className="button" disabled={busy}>
                {busy ? "Đang đặt hàng…" : "Xác nhận đặt hàng"}
              </button>
            ) : (
              <Link className="button" to="/login?next=/cart">
                Đăng nhập để đặt hàng
              </Link>
            )}
          </form>
        </div>
      )}
    </section>
  );
}
