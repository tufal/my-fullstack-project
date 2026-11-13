import ProductCard from "./ProductCard";

export default function Lists({
  data,
  cartItems = [],
  busyProduct,
  addToCart,
  decreaseQuantity,
}) {
  return (
    <div className="home-product-grid">
      {data.map((item) => {
        const quantity =
          cartItems.find(
            (entry) => String(entry.product?._id) === String(item._id)
          )?.quantity || 0;

        return (
          <ProductCard
            key={item._id}
            item={item}
            quantity={quantity}
            busy={String(busyProduct) === String(item._id)}
            onAdd={addToCart}
            onDecrease={decreaseQuantity}
          />
        );
      })}
    </div>
  );
}
