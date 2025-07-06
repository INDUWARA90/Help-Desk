import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Home, HelpCircle, User, BarChart3, PlusCircle, PieChart } from "lucide-react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("You have been logged out.");
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-rose-500 to-pink-500/90 backdrop-blur-md text-white px-6 py-5 shadow-lg fixed w-full top-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">

          {/* Logo */}
          <Link
            to="/home"
            className="text-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <span className="text-yellow-300 text-3xl">🌟</span> Peer Help Desk
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 text-sm font-medium items-center">
            <NavLink label="Home" to="/home" icon={<Home size={18} />} />
            <NavLink label="Questions" to="/all-questions" icon={<HelpCircle size={18} />} />
            <NavLink label="Ask" to="/ask-question" icon={<PlusCircle size={18} />} />
            <NavLink label="Leaderboard" to="/leader-board" icon={<BarChart3 size={18} />} />
            <NavLink label="Analytics" to="/analytics" icon={<PieChart size={18} />} />
            <NavLink label="Profile" to="/user-dashboard" icon={<User size={18} />} />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-sm px-4 py-2 rounded-full font-medium transition duration-200 shadow-sm hover:shadow-md"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-In Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-rose-600 to-pink-500 p-6 transform transition-transform duration-300 ease-in-out shadow-2xl z-40 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button onClick={toggleMenu} className="absolute top-4 right-4 text-white">
          <X size={28} />
        </button>

        {/* Mobile Nav */}
        <div className="mt-20 flex flex-col gap-5 text-white text-base font-medium">
          <NavLink label="Home" to="/home" onClick={toggleMenu} mobile icon={<Home size={18} />} />
          <NavLink label="Questions" to="/all-questions" onClick={toggleMenu} mobile icon={<HelpCircle size={18} />} />
          <NavLink label="Ask" to="/ask-question" onClick={toggleMenu} mobile icon={<PlusCircle size={18} />} />
          <NavLink label="Leaderboard" to="/leader-board" onClick={toggleMenu} mobile icon={<BarChart3 size={18} />} />
          <NavLink label="Analytics" to="/analytics" onClick={toggleMenu} mobile icon={<PieChart size={18} />} />
          <NavLink label="Profile" to="/user-dashboard" onClick={toggleMenu} mobile icon={<User size={18} />} />
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            toggleMenu();
            handleLogout();
          }}
          className="mt-10 w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-full font-medium transition shadow"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </>
  );
}

function NavLink({ label, to, onClick, mobile, icon }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${
        mobile ? "flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10" : "flex items-center gap-2"
      } text-white hover:text-yellow-300 transition duration-200`}
    >
      {icon}
      {label}
    </Link>
  );
}

export default Header;
