import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const About = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const rs = await axios.get("http://localhost:3000/products");
      setProducts(rs.data.products);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.log(err?.response?.data?.message || err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>

        <h4 className="mt-3">Loading Products...</h4>
      </div>
    </div>
  );
}
 if (error) {
  return (
    <div className="error-container">
      <h1 className="error-title">
        No Internet Connection
      </h1>

      <p className="error-text">
        Please check your network and try again.
      </p>

      <button
        className="retry-btn"
        onClick={fetchProducts}
        style={{ width: "45%" }}
      >
        Retry
      </button>
    </div>
  );
}

  return (
    <div className="container py-4">
      <h1 className="mb-4">About</h1>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {products.map((product) => (
          <div className="col" key={product._id}>
            <div className="card h-100 shadow-sm">
              <img
                src={product.image}
                alt={product.title}
                className="card-img-top"
                style={{  maxHeight: "250px" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">{product.description}</p>
                <p className="mb-1"><strong>Price:</strong> ₹{product.price}</p>
                <p className="mb-1"><strong>Category:</strong> {product.category}</p>
                <p className="mb-3"><strong>Stock:</strong> {product.stock}</p>
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => navigate("/shop")}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;