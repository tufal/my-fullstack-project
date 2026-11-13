import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
