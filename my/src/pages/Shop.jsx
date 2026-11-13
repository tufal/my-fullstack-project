import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Lists from "../components/Lists";
import { ProductCardSkeleton } from "../components/ProductCard";
import useCartApi from "../hooks/useCartApi";
import "./Home.css";

const API_URL = "https://my-backend-l1tz.onrender.com";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { cartItems, busyProduct, error: cartError, addToCart, decreaseQuantity } =
    useCartApi();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API_URL}/products`);
      if (!Array.isArray(response.data?.products)) {
        throw new Error("Unexpected products response");
      }
      setProducts(response.data.products);
    } catch (requestError) {
      console.error("Product loading failed:", requestError);
      setError("Products could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    axios
      .get(`${API_URL}/products`)
      .then((response) => {
        if (!Array.isArray(response.data?.products)) {
          throw new Error("Unexpected products response");
        }
        if (active) setProducts(response.data.products);
      })
      .catch((requestError) => {
        console.error("Product loading failed:", requestError);
        if (active) setError("Products could not be loaded. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="home-page home-catalog">
      <div className="home-section-heading">
        <div>
          <span className="home-kicker">THE FULL COLLECTION</span>
          <h2>Shop</h2>
        </div>
      </div>

      {cartError && <p className="home-notice" role="status">{cartError}</p>}

      {error ? (
        <div className="home-empty" role="alert">
          <p>{error}</p>
          <button type="button" onClick={fetchProducts}>Try again</button>
        </div>
      ) : loading ? (
        <div className="home-product-grid" aria-label="Loading products">
          {Array.from({ length: 8 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <Lists
          data={products}
          cartItems={cartItems}
          busyProduct={busyProduct}
          addToCart={addToCart}
          decreaseQuantity={decreaseQuantity}
        />
      ) : (
        <div className="home-empty">No products are available right now.</div>
      )}
    </main>
  );
}
