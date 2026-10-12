import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Check,
  Bookmark,
  User,
  LogOut,
  Briefcase,
  LayoutDashboard,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdminOrMod = user?.role === "ADMIN" || user?.role === "MODERATOR";
  const isHomePage = location.pathname === "/";

  const handleScrollTo = (id) => {
    if (isHomePage) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    navigate(`/#${id}`);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo matching reference design */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 rounded-[7px] bg-blue-600 flex items-center justify-center text-white shadow-2xs group-hover:bg-blue-700 transition-colors">
            <Check className="w-3.5 h-3.5 stroke-[3.5]" />
          </div>
          <span className="font-bold text-gray-950 text-base sm:text-lg tracking-tight">
            Opportunity Finder
          </span>
        </Link>

        {/* Center / Right Links */}
        <div className="hidden md:flex items-center gap-7">
          <button
            onClick={() => handleScrollTo("closing-soon")}
            className="text-sm font-medium text-gray-600 hover:text-gray-950 transition-colors cursor-pointer"
          >
            Closing soon
          </button>
          <button
            onClick={() => handleScrollTo("categories")}
            className="text-sm font-medium text-gray-600 hover:text-gray-950 transition-colors cursor-pointer"
          >
            Categories
          </button>
          <button
            onClick={() => handleScrollTo("features")}
            className="text-sm font-medium text-gray-600 hover:text-gray-950 transition-colors cursor-pointer"
          >
            Why it's different
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-4 pl-3 border-l border-gray-200">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/opportunities"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Explore
              </Link>
              <Link
                to="/saved"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Bookmark className="w-4 h-4" />
                <span>Saved</span>
              </Link>
              <Link
                to="/applications"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                <span>Applications</span>
              </Link>
              {isAdminOrMod && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span>{user?.displayName || "Profile"}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 pl-3">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-950 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-colors shadow-2xs"
              >
                Create free account
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => {
              handleScrollTo("closing-soon");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-gray-700"
          >
            Closing soon
          </button>
          <button
            onClick={() => {
              handleScrollTo("categories");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-gray-700"
          >
            Categories
          </button>
          <button
            onClick={() => {
              handleScrollTo("features");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-gray-700"
          >
            Why it's different
          </button>
          <Link
            to="/opportunities"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-gray-700"
          >
            Explore All Opportunities
          </Link>

          {isLoggedIn ? (
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-gray-700"
              >
                Dashboard
              </Link>
              <Link
                to="/saved"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-gray-700"
              >
                Saved Opportunities
              </Link>
              <Link
                to="/applications"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-gray-700"
              >
                Application Tracker
              </Link>
              {isAdminOrMod && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-rose-600"
                >
                  Admin Portal
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-gray-700"
              >
                Profile ({user?.displayName})
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm font-medium text-red-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-xl shadow-xs"
              >
                Create free account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
