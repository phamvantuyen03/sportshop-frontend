import { describe, it, expect } from "vitest";
import { addItem, updateQuantity, cartTotal } from "./cart";
const p = {
  id: 1,
  name: "Giày",
  category: "Chạy bộ",
  description: "",
  price: 100,
  stock: 2,
  active: true,
};
describe("cart", () => {
  it("gộp sản phẩm và giới hạn tồn kho", () => {
    let items = addItem([], p);
    items = addItem(items, p);
    items = addItem(items, p);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
    expect(cartTotal(items)).toBe(200);
  });
  it("xóa sản phẩm khi số lượng bằng 0", () => {
    expect(updateQuantity(addItem([], p), 1, 0)).toEqual([]);
  });
  it("không thêm sản phẩm hết hàng", () => {
    expect(addItem([], { ...p, stock: 0 })).toEqual([]);
  });
});
