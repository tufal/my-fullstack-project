import React from "react";
import "./list.css";

const Lists = ({ data, addToCart }) => {
  return (
    <>
      {data.map((item) => (
        <div
          key={item._id}
          className="card5"
        >
          <img
            src={item.image}
            className="card-img-top"
            alt={item.title}
          />

          <div className="card-body">
            <h5>{item.title}</h5>
            <p>{item.description}</p>
            <p>Price: ₹{item.price}</p>
            <p>Stock: {item.stock}</p>
            <p>Category: {item.category}</p>

            <button
              className="btn btn-primary"
              onClick={() => addToCart(item._id)}
              
            >
              Add To Cart
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default Lists;