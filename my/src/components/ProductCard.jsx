import { useState } from "react";
import "./ProductCard.css";

export function ProductCardSkeleton() {
  return (
    <article className="store-card store-card--skeleton" aria-hidden="true">
      <div className="store-card__media store-skeleton" />
      <div className="store-card__body">
        <span className="store-skeleton store-skeleton--category" />
        <span className="store-skeleton store-skeleton--title" />
        <span className="store-skeleton store-skeleton--description" />
        <span className="store-skeleton store-skeleton--price" />
        <span className="store-skeleton store-skeleton--button" />
      </div>
    </article>
  );
}

export default function ProductCard({
  item,
  quantity = 0,
  busy = false,
  onAdd,
  onDecrease,
}) {
  const [wishlisted, setWishlisted] = useState(false);
  const stock = Number(item.stock) || 0;
  const outOfStock = stock <= 0;
  const lowStock = stock > 0 && stock <= 5;

  return (
    <article className="store-card">
      <div className="store-card__media">
        <img
          className="store-card__image"
          src={item.image}
          alt={item.title}
          loading="lazy"
        />
        <button
          type="button"
          className={`store-card__wishlist${wishlisted ? " is-active" : ""}`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={() => setWishlisted((value) => !value)}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
        {lowStock && (
          <span className="store-card__stock-badge">Only {stock} left</span>
        )}
        {outOfStock && (
          <span className="store-card__stock-badge store-card__stock-badge--out">
            Out of stock
          </span>
        )}
      </div>

      <div className="store-card__body">
        <span className="store-card__category">{item.category}</span>
        <h3 className="store-card__title" title={item.title}>
          {item.title}
        </h3>
        <p className="store-card__description">{item.description}</p>
        <p className="store-card__price">
          ₹{Number(item.price || 0).toLocaleString("en-IN")}
        </p>

        {quantity > 0 ? (
          <div className="store-card__stepper" aria-label={`Quantity ${quantity}`}>
            <button
              type="button"
              onClick={() => onDecrease(item._id)}
              disabled={busy || quantity <= 1}
              aria-label={`Decrease ${item.title} quantity`}
            >
              −
            </button>
            <span aria-live="polite">{busy ? "…" : quantity}</span>
            <button
              type="button"
              onClick={() => onAdd(item._id)}
              disabled={busy || quantity >= stock}
              aria-label={`Increase ${item.title} quantity`}
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="store-card__add"
            onClick={() => onAdd(item._id)}
            disabled={busy || outOfStock}
          >
            {busy ? "Adding…" : outOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        )}
      </div>
    </article>
  );
}
