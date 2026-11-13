import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://my-backend-l1tz.onrender.com";

const parseCartItems = (data) => {
  const items = Array.isArray(data) ? data : data?.cart;

  if (!Array.isArray(items)) {
    throw new Error("The cart response was not in the expected format.");
  }

  return items;
};

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

const requestCart = async () => {
  const response = await axios.get(`${API_URL}/cartshow`, {
    withCredentials: true,
  });
  return parseCartItems(response.data);
};

export default function useCartApi() {
  const [cartItems, setCartItems] = useState([]);
  const [busyProduct, setBusyProduct] = useState(null);
  const [error, setError] = useState("");

  const refreshCart = useCallback(async () => {
    try {
      setCartItems(await requestCart());
      setError("");
      return true;
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          "Could not sync your cart. Please sign in and try again."
        )
      );
      return false;
    }
  }, []);

  useEffect(() => {
    let active = true;

    requestCart()
      .then((items) => {
        if (!active) return;
        setCartItems(items);
        setError("");
      })
      .catch((requestError) => {
        if (!active) return;
        setError(
          getErrorMessage(
            requestError,
            "Could not sync your cart. Please sign in and try again."
          )
        );
      });

    return () => {
      active = false;
    };
  }, []);

  const addToCart = useCallback(
    async (productId) => {
      setBusyProduct(productId);
      setError("");

      try {
        await axios.post(
          `${API_URL}/cartadd`,
          { productId },
          { withCredentials: true }
        );
        await refreshCart();
      } catch (requestError) {
        setError(
          getErrorMessage(requestError, "Could not update your cart.")
        );
      } finally {
        setBusyProduct(null);
      }
    },
    [refreshCart]
  );

  const decreaseQuantity = useCallback(
    async (productId) => {
      const item = cartItems.find(
        (entry) => String(entry.product?._id) === String(productId)
      );

      if (!item || item.quantity <= 1) return;

      setBusyProduct(productId);
      setError("");

      try {
        await axios.post(
          `${API_URL}/cartdecrease`,
          { productId },
          { withCredentials: true }
        );
        await refreshCart();
      } catch (requestError) {
        setError(
          getErrorMessage(requestError, "Could not update your cart.")
        );
      } finally {
        setBusyProduct(null);
      }
    },
    [cartItems, refreshCart]
  );

  return { cartItems, busyProduct, error, addToCart, decreaseQuantity };
}
