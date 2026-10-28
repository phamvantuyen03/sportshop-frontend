import type { CartItem, Product } from "../../types";
export function addItem(items: CartItem[], product: Product): CartItem[] {
  if (product.stock < 1) return items;
  const existing = items.find((i) => i.product.id === product.id);
  return existing
    ? items.map((i) =>
        i.product.id === product.id
          ? { product, quantity: Math.min(i.quantity + 1, product.stock, 99) }
          : i,
      )
    : [...items, { product, quantity: 1 }];
}
export function updateQuantity(
  items: CartItem[],
  id: number,
  qty: number,
): CartItem[] {
  return items
    .map((i) =>
      i.product.id === id
        ? {
            ...i,
            quantity: Math.max(
              0,
              Math.min(Math.floor(qty) || 0, i.product.stock, 99),
            ),
          }
        : i,
    )
    .filter((i) => i.quantity > 0);
}
export const cartTotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
