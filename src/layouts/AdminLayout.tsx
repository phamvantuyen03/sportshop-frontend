import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ClipboardList } from "lucide-react";
export function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside>
        <div className="eyebrow">WORKSPACE / ADMIN</div>
        <h2>
          Quản trị
          <br />
          cửa hàng.
        </h2>
        <NavLink to="/admin" end>
          <LayoutDashboard size={18} /> Tổng quan
        </NavLink>
        <NavLink to="/admin/products">
          <Package size={18} /> Sản phẩm
        </NavLink>
        <NavLink to="/admin/orders">
          <ClipboardList size={18} /> Đơn hàng
        </NavLink>
      </aside>
      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}
