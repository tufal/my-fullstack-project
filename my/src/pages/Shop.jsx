import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lists from '../components/Lists';
import "./style.css";
import { useNavigate } from 'react-router-dom';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await axios.get(
        "https://my-backend-l1tz.onrender.com/products"
      );

      setProducts(response.data.products);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    try {
      const res = await axios.post(
        "https://my-backend-l1tz.onrender.com/cartadd",
        { productId },
        {
          withCredentials: true,
        }
      );

      alert(res.data.message);
      navigate("/Cart");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return (
      <div>
        <h2>No Internet Connection</h2>
        <button onClick={fetchProducts}>Retry</button>
      </div>
    );
  }

  return (
    <div className="d-flex flex-wrap gap-4 justify-content-center">
      <Lists
        data={products}
        addToCart={addToCart}
      />
    </div>
  );
};

export default Shop;