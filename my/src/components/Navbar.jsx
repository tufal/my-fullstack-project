import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const checkUser = async () => {
    try {
      const res = await axios.get('http://localhost:3000/profile', {
        withCredentials: true,
      });

      setUser(res.data.user);
      setIsAuthenticated(true);
      setIsAdmin(res.data.admin);
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const onRegister = () => navigate('/Register');
  const onLogin = () => navigate('/Login');

  const onLogout = async () => {
    try {
      await axios.post(
        'http://localhost:3000/logout',
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error('Logout error', err);
    }

    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/Login');
  };

  return (
    <nav className="navbar navbar-dark bg-primary navbar-expand-lg py-2">
      <div className="container-fluid px-4 px-lg-5">
       
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center me-4 me-lg-5 text-decoration-none"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="me-2"
          >
            <rect width="100" height="100" rx="22" fill="#0b1329" />
            <path
              d="M22 28H54M38 28V72"
              stroke="#38BDF8"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M46 72V40L62 58L78 40V72"
              stroke="#FFFFFF"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="fw-bold tracking-tight text-white fs-5">
            TUFEL<span className="text-info fw-semibold ms-2">MANSURI</span>
          </span>
        </Link>

  
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav align-items-lg-center nav-underline me-auto gap-3 gap-lg-4 mb-3 mb-lg-0"style={{ marginLeft: "5rem" }}>
            <li className="nav-item fs-5">
              <Link to="/" className="nav-link active" aria-current="page">
                Home
              </Link>
            </li>
            <li className="nav-item fs-5">
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
            <li className="nav-item fs-5">
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
            </li>
            <li className="nav-item fs-5">
              <Link to="/Shop" className="nav-link">
                Shop
              </Link>
            </li>
            <li className="nav-item fs-5">
              <Link to="/Cart" className="nav-link">
                Cart
              </Link>
            </li>

            {isAdmin && (
              <li className="nav-item fs-5">
                <Link to="/Admin" className="nav-link text-warning fw-semibold">
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>

          {/* Right Auth Buttons */}
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={onLogout}
                className="btn btn-light fw-medium px-3"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={onRegister}
                  className="btn btn-outline-light fw-medium px-3"
                >
                  Register
                </button>
                <button
                  onClick={onLogin}
                  className="btn btn-light fw-medium px-3 ms-2"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;