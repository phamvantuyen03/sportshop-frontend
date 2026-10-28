import { api } from "../../lib/api";
import type { Order } from "../../types";
export const getOrders = (admin = false) =>
  api<Order[]>(admin ? "/admin/orders" : "/orders");
export const placeOrder = (data: {
  recipient: string;
  phone: string;
  address: string;
  items: { productId: number; quantity: number }[];
}) => api<Order>("/orders", { method: "POST", body: JSON.stringify(data) });
export const changeStatus = (id: number, status: string) =>
  api<Order>("/admin/orders/" + id + "/status", {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
