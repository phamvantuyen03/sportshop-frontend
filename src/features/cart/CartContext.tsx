import { createContext, useContext, useState, type ReactNode } from "react";
import type { CartItem, Product } from "../../types";
import { addItem, updateQuantity } from "./cart";
const Context = createContext<{
  items: CartItem[];
  add: (p: Product) => void;
  quantity: (id: number, n: number) => void;
  clear: () => void;
} | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  return (
    <Context.Provider
      value={{
        items,
        add: (p) => setItems((i) => addItem(i, p)),
        quantity: (id, n) => setItems((i) => updateQuantity(i, id, n)),
        clear: () => setItems([]),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useCart() {
  return useContext(Context)!;
}
