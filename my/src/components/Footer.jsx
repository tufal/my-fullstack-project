import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const [notice, setNotice] = useState("");

  function handleSubscribe(event) {
    event.preventDefault();
    setNotice("Newsletter signup is not available yet.");
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <section className="site-footer__brand-column">
          <Link className="site-footer__brand" to="/">TUFEL MANSURI</Link>
          <p>Everyday essentials, picked with care.</p>
          <div className="site-footer__social" aria-label="Social links">
            <a href="https://instagram.com" aria-label="Instagram">◎</a>
            <a href="https://linkedin.com" aria-label="LinkedIn">in</a>
          </div>
        </section>

        <nav aria-label="Quick links">
          <h2>Quick Links</h2>
          <Link to="/">Home</Link>
          <Link to="/Shop">Shop</Link>
          <Link to="/Cart">Cart</Link>
          <span className="site-footer__coming-soon" title="Orders are not available yet">
            My Orders <small>Coming soon</small>
          </span>
        </nav>

        <nav aria-label="Customer support">
          <h2>Customer Support</h2>
          <Link to="/contact">FAQ</Link>
          <Link to="/contact">Shipping Policy</Link>
          <Link to="/contact">Returns &amp; Refunds</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>

        <section>
          <h2>Stay in the loop</h2>
          <p>Get updates about new arrivals and store news.</p>
          <form className="site-footer__form" onSubmit={handleSubscribe}>
            <label className="visually-hidden" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Your email address"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
          {notice && <small className="site-footer__notice" role="status">{notice}</small>}
        </section>
      </div>
      <div className="site-footer__bottom">
        © 2026 Tufel Mansuri. Built with React &amp; Node.js
      </div>
    </footer>
  );
}
