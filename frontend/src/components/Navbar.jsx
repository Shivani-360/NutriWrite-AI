"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push("/");
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/generate", label: "Generate" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <span className="text-2xl">🥗</span>
          <span className="font-bold text-lg text-brand-600 dark:text-brand-400">
            NutriWrite AI
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Desktop-only auth controls */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {user?.name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary text-sm hidden md:inline-flex">
              Log In →
            </Link>
          )}

          {/* Mobile hamburger — only visible below md */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {menuOpen ? (
              <span className="text-xl leading-none">✕</span>
            ) : (
              <span className="text-xl leading-none">☰</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-3 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-3">
            {isAuthenticated ? (
              <div className="flex items-center justify-between px-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-500 hover:text-red-600"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="btn-primary text-sm w-full flex justify-center"
              >
                Log In →
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
