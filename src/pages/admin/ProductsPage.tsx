import { useEffect, useState, type FormEvent } from "react";
import {
  getAdminProducts,
  saveProduct,
  hideProduct,
} from "../../features/products/api";
import { ErrorMessage, Loading } from "../../components/Feedback";
import { money, type Product } from "../../types";
export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]),
    [loading, setLoading] = useState(true),
    [editing, setEditing] = useState<Product | null | undefined>(undefined),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function load() {
    setProducts(await getAdminProducts());
  }
  useEffect(() => {
    load()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await saveProduct(
        {
          name: String(f.get("name")),
          category: String(f.get("category")),
          description: String(f.get("description")),
          price: Number(f.get("price")),
          stock: Number(f.get("stock")),
          active: f.get("active") === "on",
        },
        editing?.id,
      );
      setEditing(undefined);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function hide(p: Product) {
    if (!window.confirm("Ẩn sản phẩm “" + p.name + "” khỏi cửa hàng?")) return;
    setBusy(true);
    setError("");
    try {
      await hideProduct(p.id);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="title-row">
        <div>
          <div className="eyebrow">DANH MỤC CỬA HÀNG</div>
          <h1>Sản phẩm</h1>
        </div>
        <button
          className="button"
          onClick={() => {
            setEditing(null);
            setError("");
          }}
        >
          + Thêm sản phẩm
        </button>
      </div>
      <ErrorMessage message={error} />
      {editing !== undefined && (
        <form
          key={editing?.id || "new"}
          className="panel product-form"
          onSubmit={submit}
        >
          <h2>{editing ? "Sửa sản phẩm" : "Sản phẩm mới"}</h2>
          <div className="form-grid">
            <label>
              Tên sản phẩm
              <input
                name="name"
                required
                maxLength={150}
                defaultValue={editing?.name}
              />
            </label>
            <label>
              Danh mục
              <input
                name="category"
                required
                maxLength={60}
                defaultValue={editing?.category}
                list="categories"
              />
              <datalist id="categories">
                {["Chạy bộ", "Fitness", "Bóng đá", "Cầu lông", "Phụ kiện"].map(
                  (c) => (
                    <option key={c} value={c} />
                  ),
                )}
              </datalist>
            </label>
            <label>
              Giá (VND)
              <input
                name="price"
                type="number"
                required
                min={1}
                max={999999999999}
                step={1}
                defaultValue={editing?.price}
              />
            </label>
            <label>
              Tồn kho
              <input
                name="stock"
                type="number"
                required
                min={0}
                max={1000000}
                step={1}
                defaultValue={editing?.stock ?? 0}
              />
            </label>
          </div>
          <label>
            Mô tả
            <textarea
              name="description"
              required
              maxLength={2000}
              defaultValue={editing?.description}
            />
          </label>
          <label className="checkbox">
            <input
              name="active"
              type="checkbox"
              defaultChecked={editing?.active ?? true}
            />{" "}
            Hiển thị trong cửa hàng
          </label>
          <div className="button-row">
            <button className="button" disabled={busy}>
              {busy ? "Đang lưu…" : "Lưu sản phẩm"}
            </button>
            <button
              className="button secondary"
              type="button"
              disabled={busy}
              onClick={() => setEditing(undefined)}
            >
              Đóng
            </button>
          </div>
        </form>
      )}
      {loading ? (
        <Loading />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <b>{p.name}</b>
                    <small>{p.category}</small>
                  </td>
                  <td>{money(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className="badge">
                      {p.active ? "Đang bán" : "Đã ẩn"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="text-button"
                      disabled={busy}
                      onClick={() => setEditing(p)}
                    >
                      Sửa
                    </button>
                    {p.active && (
                      <button
                        className="text-button danger"
                        disabled={busy}
                        onClick={() => hide(p)}
                      >
                        Ẩn
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
