import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Search, Plus, Check } from "lucide-react";
import { getProducts } from "../features/products/api";
import { useCart } from "../features/cart/CartContext";
import { ProductArt } from "../components/ProductArt";
import { ErrorMessage, Loading } from "../components/Feedback";
import { money, type Product } from "../types";
export function StorePage() {
  const [products, setProducts] = useState<Product[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [search, setSearch] = useState(""),
    [category, setCategory] = useState("Tất cả"),
    [sort, setSort] = useState("new"),
    [added, setAdded] = useState<number | null>(null);
  const { add } = useCart();
  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  const categories = ["Tất cả", ...new Set(products.map((p) => p.category))];
  const filtered = products
    .filter(
      (p) =>
        (category === "Tất cả" || p.category === category) &&
        p.name.toLocaleLowerCase("vi").includes(search.toLocaleLowerCase("vi")),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : b.id - a.id,
    );
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span /> EVERYDAY ATHLETES CLUB
          </div>
          <h1>
            BỨT PHÁ
            <br />
            THEO CÁCH <em>CỦA BẠN.</em>
          </h1>
          <p>
            Từ bước chạy đầu tiên đến cột mốc tiếp theo.
            <br />
            Tìm người bạn đồng hành cho mỗi buổi tập.
          </p>
          <a href="#products" className="button lime">
            Khám phá bộ sưu tập <ArrowUpRight size={19} />
          </a>
          <div className="hero-foot">CHẠY BỘ / FITNESS / THỂ THAO</div>
        </div>
        <div className="hero-art">
          <div className="orbit o1" />
          <div className="orbit o2" />
          <div className="orbit o3" />
          <span className="hero-number">01—06</span>
          <div className="big-arrow">↗</div>
          <div className="hero-caption">
            MAKE
            <br />
            <b>YOUR MOVE.</b>
            <span>THÊM NĂNG LƯỢNG. THÊM KHẢ NĂNG.</span>
          </div>
        </div>
      </section>
      <div className="benefits">
        <span>
          <Check size={16} /> Giá niêm yết rõ ràng
        </span>
        <span>
          <Check size={16} /> Thanh toán khi nhận hàng
        </span>
        <span>
          <Check size={16} /> Theo dõi đơn trực tuyến
        </span>
      </div>
      <section id="products" className="catalog">
        <div className="section-heading">
          <div className="eyebrow">TRANG BỊ CHO HÀNH TRÌNH</div>
          <h2>
            Sẵn sàng. Vận động. <ArrowUpRight />
          </h2>
          <p>Những món đồ thiết yếu, cho mục tiêu của bạn.</p>
        </div>
        <div className="catalog-toolbar">
          <div className="chips">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={category === c ? "selected" : ""}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="search">
            <Search size={17} />
            <input
              aria-label="Tìm sản phẩm"
              placeholder="Tìm sản phẩm…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
        <div className="results">
          <span>{filtered.length} sản phẩm</span>
          <select
            aria-label="Sắp xếp"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="new">Mới nhất</option>
            <option value="low">Giá tăng dần</option>
            <option value="high">Giá giảm dần</option>
          </select>
        </div>
        <ErrorMessage message={error} />
        {loading ? (
          <Loading />
        ) : (
          <div className="product-grid">
            {filtered.map((p) => (
              <article className="product-card" key={p.id}>
                <Link to={"/products/" + p.id} aria-label={"Xem " + p.name}>
                  <ProductArt category={p.category} name={p.name} />
                </Link>
                <div className="product-category">
                  {p.category}
                  <span>{p.stock ? "Còn hàng" : "Hết hàng"}</span>
                </div>
                <Link to={"/products/" + p.id}>
                  <h3>{p.name}</h3>
                </Link>
                <div className="product-bottom">
                  <b>{money(p.price)}</b>
                  <button
                    className="add-button"
                    disabled={!p.stock}
                    aria-label={"Thêm " + p.name + " vào giỏ"}
                    onClick={() => {
                      add(p);
                      setAdded(p.id);
                    }}
                  >
                    {added === p.id ? <Check size={20} /> : <Plus size={20} />}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        {!loading && !error && !filtered.length && (
          <div className="empty">Không tìm thấy sản phẩm phù hợp.</div>
        )}
        <p className="cart-hint" aria-live="polite">
          {added && (
            <>
              Đã thêm sản phẩm.{" "}
              <Link to="/cart">
                Xem giỏ hàng <ArrowRight size={14} />
              </Link>
            </>
          )}
        </p>
      </section>
      <section className="manifesto">
        <span>KHÔNG CẦN CHỜ ĐẾN NGÀY MAI.</span>
        <h2>
          Hôm nay là một ngày đẹp
          <br />
          để bắt đầu.
        </h2>
        <a href="#products">
          Chọn trang bị của bạn <ArrowUpRight />
        </a>
      </section>
    </>
  );
}
