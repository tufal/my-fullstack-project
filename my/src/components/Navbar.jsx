
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_URL = "https://my-backend-l1tz.onrender.com";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Mobile navbar toggle state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const checkUser = useCallback(async () => {
    try {
     

      const token = localStorage.getItem("authToken");

      const res = await axios.get(`${API_URL}/profile`, {
        withCredentials: true,
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      });

      setUser(res.data.user);
      setIsAuthenticated(true);
      setIsAdmin(res.data.admin === true);
    } catch (err) {
      console.log(
        "PROFILE ERROR:",
        err.response?.status,
        err.response?.data
      );

      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);

      localStorage.removeItem("authToken");
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser, location.pathname]);

  // Navigation click ke baad mobile menu close
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const onRegister = () => {
    setIsMenuOpen(false);
    navigate("/Register");
  };

  const onLogin = () => {
    setIsMenuOpen(false);
    navigate("/Login");
  };

  const onLogout = async () => {
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsMenuOpen(false);

      navigate("/Login");
    }
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg py-2"
        style={{
          background: "#0f172a",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        }}
      >
        <div className="container-fluid px-3 px-lg-5">

          {/* ================= LOGO ================= */}

          <Link
            to="/"
            onClick={handleNavClick}
            className="navbar-brand d-flex align-items-center text-decoration-none me-4 me-lg-5"
          >
            <svg
              width="38"
              height="38"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="me-2"
            >
              <rect
                width="100"
                height="100"
                rx="22"
                fill="#0b1329"
              />

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

            <span
              className="fw-bold fs-5"
              style={{
                color: "#ffffff",
                letterSpacing: "0.5px",
              }}
            >
              TUFEL

              <span
                className="fw-semibold ms-2"
                style={{
                  color: "#38bdf8",
                }}
              >
                MANSURI
              </span>
            </span>
          </Link>

          {/* ================= MOBILE TOGGLE ================= */}

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-controls="navbarNav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
            style={{
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "8px",
              padding: "7px 10px",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <span
              style={{
                display: "block",
                width: "23px",
                height: "2px",
                background: "#ffffff",
                margin: "5px 0",
              }}
            />

            <span
              style={{
                display: "block",
                width: "23px",
                height: "2px",
                background: "#ffffff",
                margin: "5px 0",
              }}
            />

            <span
              style={{
                display: "block",
                width: "23px",
                height: "2px",
                background: "#ffffff",
                margin: "5px 0",
              }}
            />
          </button>

          {/* ================= NAVBAR MENU ================= */}

          <div
            className={`collapse navbar-collapse ${
              isMenuOpen ? "show" : ""
            }`}
            id="navbarNav"
          >

            {/* ================= NAVIGATION ================= */}

            <ul
              className="navbar-nav align-items-lg-center me-auto gap-1 gap-lg-3 mb-3 mb-lg-0 mt-3 mt-lg-0"
              style={{
                marginLeft: "3rem",
              }}
            >

              <li className="nav-item">
                <Link
                  to="/"
                  onClick={handleNavClick}
                  className={`nav-link px-3 py-2 ${
                    location.pathname === "/" ? "active-nav" : ""
                  }`}
                >
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/about"
                  onClick={handleNavClick}
                  className={`nav-link px-3 py-2 ${
                    location.pathname === "/about"
                      ? "active-nav"
                      : ""
                  }`}
                >
                  About
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/contact"
                  onClick={handleNavClick}
                  className={`nav-link px-3 py-2 ${
                    location.pathname === "/contact"
                      ? "active-nav"
                      : ""
                  }`}
                >
                  Contact
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/Shop"
                  onClick={handleNavClick}
                  className={`nav-link px-3 py-2 ${
                    location.pathname === "/Shop"
                      ? "active-nav"
                      : ""
                  }`}
                >
                  Shop
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/Cart"
                  onClick={handleNavClick}
                  className={`nav-link px-3 py-2 ${
                    location.pathname === "/Cart"
                      ? "active-nav"
                      : ""
                  }`}
                >
                  Cart
                </Link>
              </li>

              {/* ================= ADMIN ================= */}

              {isAdmin && (
                <li className="nav-item">
                  <Link
                    to="/Admin"
                    onClick={handleNavClick}
                    className={`nav-link px-3 py-2 ${
                      location.pathname === "/Admin"
                        ? "active-admin-nav"
                        : "admin-nav"
                    }`}
                  >
                    Admin Panel
                  </Link>
                </li>
              )}
            </ul>

            {/* ================= AUTH ================= */}

            <div
              className="d-flex align-items-center gap-2 pb-3 pb-lg-0"
              style={{
                borderTop:
                  "1px solid rgba(255,255,255,0.08)",
                paddingTop: "15px",
              }}
            >

              {isAuthenticated ? (
                <>
                  <span
                    className="fw-medium me-2"
                    style={{
                      color: "#e2e8f0",
                    }}
                  >
                    {user?.name}
                  </span>

                  <button
                    onClick={onLogout}
                    className="btn fw-semibold px-3"
                    style={{
                      background: "#ffffff",
                      color: "#0f172a",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onRegister}
                    className="btn fw-semibold px-3"
                    style={{
                      color: "#ffffff",
                      border:
                        "1px solid rgba(255,255,255,0.35)",
                      background: "transparent",
                      borderRadius: "8px",
                    }}
                  >
                    Register
                  </button>

                  <button
                    onClick={onLogin}
                    className="btn fw-semibold px-3"
                    style={{
                      background: "#38bdf8",
                      color: "#082f49",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ================= NAVBAR CSS ================= */}

      <style>{`
        .nav-link {
          color: #cbd5e1 !important;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          color: #ffffff !important;
          background: rgba(255,255,255,0.07);
        }

        .active-nav {
          color: #38bdf8 !important;
          background: rgba(56,189,248,0.10);
        }

        .admin-nav {
          color: #fbbf24 !important;
        }

        .admin-nav:hover {
          color: #fcd34d !important;
          background: rgba(251,191,36,0.08);
        }

        .active-admin-nav {
          color: #fbbf24 !important;
          background: rgba(251,191,36,0.10);
        }

        .navbar-toggler:focus {
          box-shadow: 0 0 0 2px rgba(56,189,248,0.25);
        }

        @media (max-width: 991.98px) {
          .navbar-collapse {
            padding-top: 10px;
          }

          .navbar-nav {
            margin-left: 0 !important;
            width: 100%;
          }

          .navbar-nav .nav-item {
            width: 100%;
          }

          .navbar-nav .nav-link {
            width: 100%;
          }

          .navbar-collapse > .d-flex {
            width: 100%;
            flex-wrap: wrap;
          }
        }

        @media (min-width: 992px) {
          .navbar-collapse > .d-flex {
            border-top: none !important;
            padding-top: 0 !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
