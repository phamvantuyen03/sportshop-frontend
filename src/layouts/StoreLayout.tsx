import { Link, NavLink, Outlet } from "react-router-dom";
import { ArrowUpRight, ShoppingBag, Activity } from "lucide-react";
import { useAuth } from "../features/auth/AuthContext";
import { useCart } from "../features/cart/CartContext";
export function StoreLayout() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  return (
    <>
      <div className="announcement">
        SẴN SÀNG CHO MỖI NGÀY VẬN ĐỘNG <span>MOVE YOUR WAY ↗</span>
      </div>
      <header>
        <Link className="brand" to="/">
          <Activity /> SPORTSHOP<span>®</span>
        </Link>
        <nav>
          <NavLink to="/" end>
            Cửa hàng
          </NavLink>
          <NavLink to="/orders">Đơn hàng</NavLink>
          {user?.role === "ADMIN" && (
            <NavLink to="/admin">
              Quản trị <ArrowUpRight size={14} />
            </NavLink>
          )}
        </nav>
        <div className="header-actions">
          {user ? (
            <button className="text-button" onClick={logout}>
              Đăng xuất · {user.name.split(" ").at(-1)}
            </button>
          ) : (
            <Link to="/login">Đăng nhập</Link>
          )}
          <Link
            to="/cart"
            className="cart-link"
            aria-label={
              "Giỏ hàng " +
              items.reduce((s, i) => s + i.quantity, 0) +
              " sản phẩm"
            }
          >
            <ShoppingBag size={20} />
            <span>{items.reduce((s, i) => s + i.quantity, 0)}</span>
          </Link>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Link className="brand" to="/">
          SPORTSHOP®
        </Link>
        <p>Chuyển động nhỏ. Thay đổi lớn.</p>
        <span>Đồ thể thao cho hành trình của bạn.</span>
      </footer>
    </>
  );
}
