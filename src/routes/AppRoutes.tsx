import { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  Link,
} from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { StoreLayout } from "../layouts/StoreLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { StorePage } from "../pages/StorePage";
import { ProductPage } from "../pages/ProductPage";
import { AuthPage } from "../pages/AuthPage";
import { CartPage } from "../pages/CartPage";
import { OrdersPage } from "../pages/OrdersPage";
import { DashboardPage } from "../pages/admin/DashboardPage";
import { ProductsPage } from "../pages/admin/ProductsPage";
import { AdminOrdersPage } from "../pages/admin/AdminOrdersPage";
function Protected({ admin = false }: { admin?: boolean }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user)
    return (
      <Navigate
        to={"/login?next=" + encodeURIComponent(location.pathname)}
        replace
      />
    );
  if (admin && user.role !== "ADMIN")
    return (
      <section className="page">
        <h1>Không có quyền truy cập</h1>
        <Link to="/">Về cửa hàng</Link>
      </section>
    );
  return <Outlet />;
}
export function AppRoutes() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<StorePage />} />
        <Route path="products/:id" element={<ProductPage />} />
        <Route path="login" element={<AuthPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route element={<Protected />}>
          <Route path="orders" element={<OrdersPage />} />
        </Route>
        <Route element={<Protected admin />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
          </Route>
        </Route>
        <Route
          path="*"
          element={
            <section className="page">
              <h1>Không tìm thấy trang</h1>
              <Link to="/">Về cửa hàng</Link>
            </section>
          }
        />
      </Route>
    </Routes>
  );
}
