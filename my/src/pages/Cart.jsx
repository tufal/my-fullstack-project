import React, { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const grandTotalPrice = data.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  const fetchCart = async () => {
    try {
      const res = await axios.get("https://my-backend-l1tz.onrender.com/cartshow", {
        withCredentials: true,
      });

      setData(Array.isArray(res.data) ? res.data : res.data.cart);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeFromCart = async (cartId) => {
    try {
      await axios.delete(
        `https://my-backend-l1tz.onrender.com/cartremove/${cartId}`,
        {
          withCredentials: true,
        }
      );

      fetchCart();
    } catch (err) {
      console.log(err);
      alert("Failed to remove item");
    }
  };

  const addQuantity = async (productId) => {
    try {
      await axios.post(
        "https://my-backend-l1tz.onrender.com/cartadd",
        { productId },
        {
          withCredentials: true,
        }
      );

      fetchCart();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const decreaseQuantity = async (productId) => {
    try {
      await axios.post(
        "https://my-backend-l1tz.onrender.com/cartdecrease",
        { productId },
        {
          withCredentials: true,
        }
      );

      fetchCart();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="container py-5">


      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">My Cart</h2>
          <p className="text-muted mb-0">
            Review your items before checkout
          </p>
        </div>

        <span className="badge bg-dark px-3 py-2 rounded-pill">
          {data.length} Items
        </span>
      </div>

      {data.length === 0 ? (
       
        <div
          className="text-center py-5 px-3 rounded-4"
          style={{
            background: "#f8f9fa",
            border: "1px solid #eee",
          }}
        >
          <img
            src="./data/m.png"
            alt="Empty Cart"
            style={{
              width: "220px",
              height: "220px",
              objectFit: "contain",
              marginBottom: "20px",
            }}
          />

          <h4 className="fw-bold mb-2">
            Your cart is empty
          </h4>

          <p className="text-muted mb-0">
            Looks like you haven't added anything to your cart yet.
          </p>
        </div>
      ) : (
        <div className="row g-4">

       
          <div className="col-lg-8">

            {data.map((item) => (
              <div
                className="card border-0 mb-3 rounded-4"
                key={item._id}
                style={{
                  boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                }}
              >
                <div className="card-body p-3 p-md-4">

                  <div className="row align-items-center g-3">

                  
                    <div className="col-4 col-md-3">
                      <div
                        style={{
                          height: "150px",
                          background: "#f7f7f7",
                          borderRadius: "15px",
                          overflow: "hidden",
                          border: "1px solid #f0f0f0",
                          padding: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            objectPosition: "center",
                            display: "block",
                            borderRadius: "12px",
                            background: "#fff",
                            transition: "transform 0.3s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform =
                              "scale(1.06)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform =
                              "scale(1)")
                          }
                        />
                      </div>
                    </div>

               
                    <div className="col-8 col-md-5">

                      <h5 className="fw-bold mb-2">
                        {item.product.title}
                      </h5>

                      <p
                        className="text-muted mb-2"
                        style={{
                          fontSize: "13px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.product.description}
                      </p>

                      <h5 className="fw-bold text-success mb-0">
                        ₹
                        {item.product.price.toLocaleString("en-IN")}
                      </h5>

                    </div>

                    <div className="col-7 col-md-2">

                      <small className="text-muted d-block mb-2">
                        Quantity
                      </small>

                      <div
                        className="d-flex align-items-center "
                        style={{
                          border: "1px solid #e3e3e3",
                          borderRadius: "12px",
                          width: "fit-content",
                          overflow: "hidden",
                          background: "#f8f9fa",
                          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
                        }}
                      >

                        <button
                          onClick={() =>
                            decreaseQuantity(item.product._id)
                          }
                          style={{
                            width: "36px",
                            height: "36px",
                            border: "none",
                            background: "#e31220",
                            color: "#fff",
                            fontSize: "22px",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            lineHeight: 1,
                            padding: 0,
                          }}
                        >
                          −
                        </button>

                        <span
                          style={{
                            width: "42px",
                            textAlign: "center",
                            fontWeight: "700",
                            fontSize: "15px",
                            color: "#212529",
                            lineHeight: "36px",
                            background: "#fff",
                          }}
                        >
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            addQuantity(item.product._id)
                          }
                          style={{
                            width: "36px",
                            height: "36px",
                            border: "none",
                            background: "#2c5dff",
                            color: "#fff",
                            fontSize: "22px",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            lineHeight: 1,
                            padding: 0,
                          }}
                        >
                          +
                        </button>

                      </div>
                    </div>

                    {/* Subtotal + Remove */}
                    <div className="col-5 col-md-2 text-md-end">

                      <small className="text-muted">
                        Subtotal
                      </small>

                      <div className="fw-bold text-dark mb-3">
                        ₹
                        {(
                          item.product.price *
                          item.quantity
                        ).toLocaleString("en-IN")}
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(item._id)
                        }
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                </div>
              </div>
            ))}

          </div>

          <div className="col-lg-4">

            <div
              className="card border-0 rounded-4 sticky-top"
              style={{
                top: "20px",
                boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
              }}
            >

              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  Order Summary
                </h4>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">
                    Items
                  </span>

                  <span className="fw-semibold">
                    {data.length}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">
                    Subtotal
                  </span>

                  <span className="fw-semibold">
                    ₹{grandTotalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">
                    Delivery
                  </span>

                  <span className="text-success fw-semibold">
                    FREE
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <span className="fw-bold fs-5">
                    Total
                  </span>

                  <span className="fw-bold fs-4 text-success">
                    ₹{grandTotalPrice.toLocaleString("en-IN")}
                  </span>

                </div>

                <button
                  className="btn btn-dark w-100 py-3 rounded-3 fw-bold"
                  style={{
                    transition: "0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(0)";
                  }}
                >
                  Proceed to Checkout →
                </button>

              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;