import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  
  const [error, setError] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
   
    
    try {
      const res = await axios.post(
    "https://my-backend-l1tz.onrender.com/login",
   
    {
        email: form.email.trim(),
        password: form.password
    },
    {
        withCredentials: true
    }
    
);

      alert(res.data.message || "Login successful");

   

      setForm({
        email: "",
        password: ""
      });
      


      navigate("/Shop");
       
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Login failed";
       console.log(err.response?.data?.message);
      setError(message);
      alert(message);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <form
        className='containt'
        style={{ borderRadius: "20px", maxWidth: "420px", width: "100%" }}
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label htmlFor="email" className="form-label bg-dark text-light">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            autoComplete="username"
            value={form.email}
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label bg-dark text-light">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            autoComplete="current-password"
            value={form.password}
            maxLength={100}
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <a href="/Forget" className="d-block mb-3 text-decoration-none">Forgot Password?</a>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={!form.email.trim() || !form.password}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;


