import { api } from "../../lib/api";
import type { Product } from "../../types";
export const getProducts = () => api<Product[]>("/products");
export const getProduct = (id: string) => api<Product>("/products/" + id);
export const getAdminProducts = () => api<Product[]>("/admin/products");
export const saveProduct = (value: Omit<Product, "id">, id?: number) =>
  api<Product>("/admin/products" + (id ? "/" + id : ""), {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(value),
  });
export const hideProduct = (id: number) =>
  api<void>("/admin/products/" + id, { method: "DELETE" });
