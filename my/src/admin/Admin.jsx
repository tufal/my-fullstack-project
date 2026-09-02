import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.css";

const API = "https://my-backend-l1tz.onrender.com";

const emptyForm = {
  title: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: "",
};

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const isEditing = editId !== null;

  useEffect(() => {
    loadProducts();
    const saved = localStorage.getItem("darkMode");
    if (saved) setDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data.products || []);
    } catch (error) {
      showMessage("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditId(product._id);
    setForm({
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      image: product.image || "",
      stock: product.stock || "",
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      showMessage("Please fill in all required fields", "error");
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        await axios.put(`${API}/admin/products/${editId}`, form, {
          withCredentials: true,
        });
        showMessage("✅ Product updated successfully!");
      } else {
        await axios.post(`${API}/admin/product`, form, {
          withCredentials: true,
        });
        showMessage("✅ Product added successfully!");
      }

      await loadProducts();
      closeForm();
      setActiveTab("products");
    } catch (error) {
      showMessage(
        error?.response?.data?.message || "❌ Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;

    setLoading(true);
    try {
      await axios.delete(`${API}/admin/products/${id}`, {
        withCredentials: true,
      });
      await loadProducts();
      showMessage("🗑️ Product deleted!");
    } catch (error) {
      showMessage("❌ Failed to delete product", "error");
    } finally {
      setLoading(false);
    }
  };

  const totalStock = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const totalCategories = new Set(products.map(p => p.category).filter(Boolean)).size;

  const stats = [
    { icon: "📦", label: "Products", value: products.length, color: "#6c63ff" },
    { icon: "📊", label: "Total Stock", value: totalStock, color: "#10b981" },
    { icon: "🏷️", label: "Categories", value: totalCategories, color: "#f59e0b" },
  ];

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🛍️</div>
          <div>
            <h3>Store<span>Panel</span></h3>
            <small>Admin Dashboard</small>
          </div>
        </div>

        <nav className="nav">
          <button
            className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("dashboard");
              setShowForm(false);
            }}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>
          <button
            className={`nav-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("products");
              setShowForm(false);
            }}
          >
            <span className="nav-icon">📦</span>
            <span className="nav-text">Products</span>
          </button>
          <button className="add-btn" onClick={openAddForm}>
            <span className="nav-icon">➕</span>
            <span className="nav-text">Add Product</span>
          </button>
        </nav>

        <div className="user">
          <div className="avatar">A</div>
          <div>
            <strong>Admin</strong>
            <small>Store Manager</small>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <span className="label">STORE MANAGEMENT</span>
            <h2>{activeTab === "dashboard" ? "Dashboard" : "All Products"}</h2>
          </div>
          <div className="actions">
            <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button className="primary-btn" onClick={openAddForm}>
              <span>➕</span> Add Product
            </button>
          </div>
        </header>

        <div className="content">
          {/* Toast Message */}
          {message && (
            <div className={`toast ${message.includes("error") || message.includes("❌") ? "error" : ""}`}>
              {message}
            </div>
          )}

          {/* Stats Cards */}
          <div className="stats">
            {stats.map((stat, index) => (
              <div className="stat-card" key={index}>
                <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-info">
                  <small>{stat.label}</small>
                  <h3>{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="welcome">
              <div className="welcome-content">
                <div className="welcome-icon">✨</div>
                <div className="welcome-text">
                  <span className="badge">WELCOME BACK</span>
                  <h2>Manage Your Store</h2>
                  <p>
                    Add products, track inventory, and grow your business from
                    one place.
                  </p>
                </div>
                <button className="primary-btn" onClick={openAddForm}>
                  ➕ Create Product
                </button>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <>
              <div className="section-header">
                <div>
                  <span className="badge">INVENTORY</span>
                  <h2>Products</h2>
                </div>
                <span className="count">{products.length} items</span>
              </div>

              {loading && products.length === 0 ? (
                <div className="empty">
                  <div className="spinner">⏳</div>
                  <h3>Loading...</h3>
                </div>
              ) : products.length > 0 ? (
                <div className="product-grid">
                  {products.map((product) => (
                    <div className="product-card" key={product._id}>
                      <div className="product-image">
                        {product.image ? (
                          <img src={product.image} alt={product.title} />
                        ) : (
                          <span className="placeholder-icon">🖼️</span>
                        )}
                        <span className="category-tag">
                          {product.category || "General"}
                        </span>
                      </div>
                      <div className="product-body">
                        <h4>{product.title}</h4>
                        <p>{product.description}</p>
                        <div className="product-meta">
                          <div>
                            <small>PRICE</small>
                            <strong>₹{Number(product.price).toFixed(2)}</strong>
                          </div>
                          <div>
                            <small>STOCK</small>
                            <span
                              className={`stock ${Number(product.stock) > 0 ? "in" : "out"}`}
                            >
                              {Number(product.stock) > 0
                                ? `${product.stock} units`
                                : "Out of stock"}
                            </span>
                          </div>
                        </div>
                        <div className="product-actions">
                          <button className="edit-btn" onClick={() => openEditForm(product)}>
                            ✏️ Edit
                          </button>
                          <button className="delete-btn" onClick={() => deleteProduct(product._id, product.title)}>
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty">
                  <span>📭</span>
                  <h3>No Products</h3>
                  <p>Add your first product to get started</p>
                  <button className="primary-btn" onClick={openAddForm}>
                    ➕ Add Product
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ✅ MODAL WITH INLINE STYLES - WORKING */}
      {showForm && (
        <div 
          onClick={closeForm}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 15, 26, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 999999,
            padding: '20px',
            margin: 0,
            visibility: 'visible',
            opacity: 1,
            pointerEvents: 'auto'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '92vh',
              overflowY: 'auto',
              overflowX: 'hidden',
              background: darkMode ? '#1a1a2e' : '#ffffff',
              color: darkMode ? '#ffffff' : '#1a1a2e',
              borderRadius: '24px',
              boxShadow: '0 30px 90px rgba(0,0,0,0.35)',
              zIndex: 1000000,
              visibility: 'visible',
              opacity: 1,
              pointerEvents: 'auto'
            }}
          >
            <div className="modal-header">
              <div>
                <span className="badge">{isEditing ? "✏️ EDIT" : "🆕 NEW"}</span>
                <h2>{isEditing ? "Update Product" : "Add Product"}</h2>
              </div>
              <button className="close-btn" onClick={closeForm}>
                ✕
              </button>
            </div>

            <form onSubmit={saveProduct}>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <span>📝</span> Title <span className="required">*</span>
                  </label>
                  <input
                    name="title"
                    placeholder="Enter product name"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <span>🏷️</span> Category <span className="required">*</span>
                  </label>
                  <input
                    name="category"
                    placeholder="Enter category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group full">
                  <label>
                    <span>📄</span> Description <span className="required">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    placeholder="Write a short product description..."
                    value={form.description}
                    onChange={handleChange}
                    required
                    className="form-textarea"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <span>💰</span> Price <span className="required">*</span>
                  </label>
                  <input
                    name="price"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <span>📦</span> Stock <span className="required">*</span>
                  </label>
                  <input
                    name="stock"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group full">
                  <label>
                    <span>🖼️</span> Image URL
                  </label>
                  <input
                    name="image"
                    placeholder="https://example.com/image.jpg"
                    value={form.image}
                    onChange={handleChange}
                    className="form-input"
                  />
                  {form.image && (
                    <div className="image-preview">
                      <img src={form.image} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? (
                    "⏳ Saving..."
                  ) : isEditing ? (
                    "✅ Update"
                  ) : (
                    "➕ Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;