export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
}
export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}
export interface AuthResponse {
  token: string;
  user: User;
}
export interface CartItem {
  product: Product;
  quantity: number;
}
export interface Order {
  id: number;
  recipient: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  createdAt: string;
  items: {
    productId: number;
    name: string;
    unitPrice: number;
    quantity: number;
  }[];
}
export const money = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value,
  );
export const statusLabels: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};
