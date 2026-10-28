import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../features/products/api";
import { useCart } from "../features/cart/CartContext";
import { ProductArt } from "../components/ProductArt";
import { ErrorMessage, Loading } from "../components/Feedback";
import { money, type Product } from "../types";
export function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null),
    [error, setError] = useState(""),
    [added, setAdded] = useState(false);
  const { add } = useCart();
  useEffect(() => {
    setProduct(null);
    setError("");
    setAdded(false);
    getProduct(id!)
      .then(setProduct)
      .catch((e) => setError(e.message));
  }, [id]);
  return (
    <section className="page">
      <Link to="/">← Cửa hàng</Link>
      <ErrorMessage message={error} />
      {!product && !error ? (
        <Loading />
      ) : (
        product && (
          <div className="detail">
            <ProductArt large category={product.category} name={product.name} />
            <div>
              <div className="eyebrow">{product.category}</div>
              <h1>{product.name}</h1>
              <p>{product.description}</p>
              <h2>{money(product.price)}</h2>
              <p>Còn {product.stock} sản phẩm · Thanh toán COD</p>
              <button
                className="button"
                disabled={!product.stock}
                onClick={() => {
                  add(product);
                  setAdded(true);
                }}
              >
                {product.stock ? "Thêm vào giỏ hàng" : "Hết hàng"}
              </button>
              {added && (
                <p role="status">
                  Đã thêm. <Link to="/cart">Đến giỏ hàng →</Link>
                </p>
              )}
            </div>
          </div>
        )
      )}
    </section>
  );
}
