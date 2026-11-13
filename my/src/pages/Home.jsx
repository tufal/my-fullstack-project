import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import Lists from "../components/Lists";
import { ProductCardSkeleton } from "../components/ProductCard";
import useCartApi from "../hooks/useCartApi";
import "./Home.css";

const API_URL = "https://my-backend-l1tz.onrender.com";

const benefits = [
  ["↗", "Free Delivery", "On qualifying orders"],
  ["◇", "Secure Payments", "Protected checkout"],
  ["↺", "7-Day Easy Returns", "Simple return process"],
  ["♡", "24/7 Support", "We're here to help"],
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const { cartItems, busyProduct, error: cartError, addToCart, decreaseQuantity } =
    useCartApi();

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const response = await axios.get(`${API_URL}/products`);
      if (!Array.isArray(response.data?.products)) {
        throw new Error("Unexpected products response");
      }
      setProducts(response.data.products);
    } catch (error) {
      console.error("Product loading failed:", error);
      setLoadError("Products could not be loaded. Please try again.");
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
      .catch((error) => {
        console.error("Product loading failed:", error);
        if (active) setLoadError("Products could not be loaded. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((item) => item.category).filter(Boolean))],
    [products]
  );

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const searchableText = `${item.title} ${item.description} ${item.category}`.toLowerCase();
      return matchesCategory && searchableText.includes(query);
    });

    if (sort === "low") filtered.sort((a, b) => a.price - b.price);
    if (sort === "high") filtered.sort((a, b) => b.price - a.price);
    if (sort === "name") filtered.sort((a, b) => a.title.localeCompare(b.title));
    return filtered;
  }, [products, category, search, sort]);

  return (
    <div className="home-page">
      <Banner />

      <section className="home-catalog" aria-labelledby="featured-heading">
        <div className="home-section-heading">
          <div>
            <span className="home-kicker">THE EVERYDAY EDIT</span>
            <h2 id="featured-heading">Featured products</h2>
          </div>
          <Link to="/Shop">Explore the shop <span aria-hidden="true">→</span></Link>
        </div>

        <div className="home-toolbar">
          <label className="home-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
            />
          </label>
          <label className="home-sort">
            <span className="visually-hidden">Sort products</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </label>
        </div>

        <div className="home-categories" aria-label="Filter by category">
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              className={category === name ? "is-selected" : ""}
              aria-pressed={category === name}
              onClick={() => setCategory(name)}
            >
              {name}
            </button>
          ))}
        </div>

        {cartError && <p className="home-notice" role="status">{cartError}</p>}

        {loadError ? (
          <div className="home-empty" role="alert">
            <p>{loadError}</p>
            <button type="button" onClick={loadProducts}>Try again</button>
          </div>
        ) : loading ? (
          <div className="home-product-grid" aria-label="Loading products">
            {Array.from({ length: 8 }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            <Lists
              data={visibleProducts}
              cartItems={cartItems}
              busyProduct={busyProduct}
              addToCart={addToCart}
              decreaseQuantity={decreaseQuantity}
            />
            {visibleProducts.length === 0 && (
              <div className="home-empty">No products match your search.</div>
            )}
          </>
        )}
      </section>

      <section className="home-benefits" aria-label="Shopping benefits">
        {benefits.map(([icon, title, detail]) => (
          <div className="home-benefit" key={title}>
            <span className="home-benefit__icon" aria-hidden="true">{icon}</span>
            <div><strong>{title}</strong><span>{detail}</span></div>
          </div>
        ))}
      </section>
    </div>
  );
}
