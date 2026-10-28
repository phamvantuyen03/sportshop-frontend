# Sportshop Frontend

Ứng dụng React + TypeScript + Vite cho cửa hàng đồ thể thao. Repo độc lập với backend Java, giao tiếp REST JSON qua /api.

## Chạy phát triển

Yêu cầu Node.js 22.12+ (đã kiểm tra với 22.19).

```sh
npm ci
npm run dev
```

Mở http://localhost:5173. Chạy backend trên cổng 8080 trước khi sử dụng dữ liệu. Vite proxy /api sang http://localhost:8080 nên không cần cấu hình CORS khi chạy theo cách này. Sao chép .env.example thành .env nếu cần đổi API_PROXY_TARGET hoặc VITE_API_BASE_URL; biến VITE_* là công khai, không đặt secret trong đó.

## Chức năng

- /: danh sách, tìm tên, lọc danh mục, sắp xếp giá.
- /products/:id: chi tiết sản phẩm.
- /login: đăng nhập, đăng ký tài khoản USER.
- /cart: giỏ hàng, thông tin nhận hàng, đặt hàng COD.
- /orders: đơn hàng thuộc tài khoản đang đăng nhập.
- /admin: thống kê cửa hàng; /admin/products: thêm, sửa, ẩn sản phẩm; /admin/orders: cập nhật trạng thái.

Đăng nhập bằng tài khoản ADMIN cấu hình ở backend để thấy menu Quản trị. Route guard ở FE chỉ hỗ trợ trải nghiệm; backend mới là nơi thực thi phân quyền.

## Cấu trúc

```text
src/
  components/       Thành phần giao diện dùng chung
  features/auth/    Context đăng nhập
  features/cart/    Context và logic giỏ hàng
  features/products/api.ts
  features/orders/api.ts
  layouts/          Bố cục cửa hàng và admin
  lib/api.ts        HTTP client, bearer token, lỗi API
  pages/            Trang người mua
  pages/admin/      Trang quản trị
  routes/           Routes và kiểm tra vai trò
  styles/           CSS responsive
  types.ts          Kiểu dữ liệu API
```

## Kiểm tra

```sh
npm test
npm run build
```

## Docker cùng backend

Đặt hai repo cạnh nhau, đúng tên sportshop-frontend và sportshop-backend. Từ repo backend, tạo .env theo README rồi chạy:

```sh
docker compose -f compose.yaml -f compose.full.yaml up --build
```

Truy cập http://localhost:3000. Nginx phục vụ bản build React và chuyển /api đến backend:8080 trong mạng Docker. Dockerfile FE cần chạy cùng service backend; tên này được dùng trong nginx.conf.

## Phạm vi bản khởi đầu

Token và giỏ hàng hiện chỉ lưu trong bộ nhớ của tab: tải lại trang cần đăng nhập lại và giỏ hàng được xóa. Không dùng localStorage để lưu JWT. Token hết hạn sau 1 giờ; chưa có refresh token. Đăng xuất xóa token phía trình duyệt, chưa thu hồi token đã phát hành.

Hình sản phẩm là minh họa bằng icon; chưa có upload ảnh, biến thể size/màu, mã giảm giá, thanh toán trực tuyến và phí vận chuyển. Có trạng thái loading, lỗi, giỏ trống và trang không tìm thấy. Font Google có fallback Arial khi offline.

## Git

Repo đã khởi tạo nhánh main tại máy. Để đẩy lên một remote rỗng do bạn tạo:

```sh
git remote add origin <URL-REPO-FRONTEND>
git push -u origin main
```
