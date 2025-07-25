import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  LogIn,
  Home,
  HelpCircle,
  User,
  BarChart3,
  PlusCircle,
  PieChart,
} from "lucide-react";
import { Dialog } from "@headlessui/react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const user = sessionStorage.getItem("currentUser");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://helpdesk-production-c4f9.up.railway.app/api/auth/signout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        // Clear tokens and user info from storage
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("currentUser");

        // Update app state
        setIsLoggedIn(false);
        setLogoutSuccess(true);
        setError(null);

        // Navigate to login page
        navigate("/");
      } else {
        const errorData = await response.json();
        setError("Logout failed: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Logout Error:", error);
      setError("An error occurred during logout.");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };


  return (
    <>
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-rose-500 to-pink-500/90 backdrop-blur-md text-white px-6 py-5 shadow-lg fixed w-full top-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <span className="text-yellow-300 text-3xl">🌟</span> Peer Help Desk
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 text-sm font-medium items-center">
            <NavLink label="Home" to="/" icon={<Home size={18} />} />
            <NavLink label="Questions" to="/all-questions" icon={<HelpCircle size={18} />} />
            <NavLink label="Ask" to="/ask-question" icon={<PlusCircle size={18} />} />
            {/* <NavLink label="Leaderboard" to="/leader-board" icon={<BarChart3 size={18} />} />
            <NavLink label="Analytics" to="/analytics" icon={<PieChart size={18} />} /> */}
            <NavLink label="Profile" to="/user-dashboard" icon={<User size={18} />} />

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-sm px-4 py-2 rounded-full font-medium transition duration-200 shadow-sm hover:shadow-md"
              >
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-sm px-4 py-2 rounded-full font-medium transition duration-200 shadow-sm hover:shadow-md"
              >
                <LogIn size={16} /> Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-In Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-rose-600 to-pink-500 p-6 transform transition-transform duration-300 ease-in-out shadow-2xl z-40 ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <button onClick={toggleMenu} className="absolute top-4 right-4 text-white">
          <X size={28} />
        </button>

        <div className="mt-20 flex flex-col gap-5 text-white text-base font-medium">
          <NavLink label="Home" to="/" onClick={toggleMenu} mobile icon={<Home size={18} />} />
          <NavLink label="Questions" to="/all-questions" onClick={toggleMenu} mobile icon={<HelpCircle size={18} />} />
          <NavLink label="Ask" to="/ask-question" onClick={toggleMenu} mobile icon={<PlusCircle size={18} />} />
          {/* <NavLink label="Leaderboard" to="/leader-board" onClick={toggleMenu} mobile icon={<BarChart3 size={18} />} />
          <NavLink label="Analytics" to="/analytics" onClick={toggleMenu} mobile icon={<PieChart size={18} />} /> */}
          <NavLink label="Profile" to="/user-dashboard" onClick={toggleMenu} mobile icon={<User size={18} />} />

          {isLoggedIn ? (
            <button
              onClick={() => {
                toggleMenu();
                handleLogout();
              }}
              className="mt-10 w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-full font-medium transition shadow"
            >
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <button
              onClick={() => {
                toggleMenu();
                handleLogin();
              }}
              className="mt-10 w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-full font-medium transition shadow"
            >
              <LogIn size={18} /> Login
            </button>
          )}
        </div>
      </div>

      {/* Error Dialog */}
      <Dialog
        open={!!error}
        onClose={() => setError(null)}
        className="fixed z-50 inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <Dialog.Panel className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl text-center space-y-5">
          <Dialog.Title className="text-2xl font-bold text-red-600">Error</Dialog.Title>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 px-6 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold transition"
          >
            Close
          </button>
        </Dialog.Panel>
      </Dialog>

      {/* Logout Success Dialog */}
      <Dialog
        open={logoutSuccess}
        onClose={() => setLogoutSuccess(false)}
        className="fixed z-50 inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <Dialog.Panel className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-5 text-center">
          <Dialog.Title className="text-2xl font-bold text-emerald-600">Logout Successful</Dialog.Title>
          <p className="text-gray-700">You have successfully logged out.</p>
          <button
            onClick={() => setLogoutSuccess(false)}
            className="mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-semibold shadow-lg transition-all"
          >
            Continue
          </button>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

function NavLink({ label, to, onClick, mobile, icon }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${mobile
        ? "flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10"
        : "flex items-center gap-2"
        } text-white hover:text-yellow-300 transition duration-200`}
    >
      {icon}
      {label}
    </Link>
  );
}

export default Header;
