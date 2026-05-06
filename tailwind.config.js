import { FiHome, FiShoppingCart, FiUsers } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function Layout({ children }) {
  const [dark, setDark] = useState(false);
  const location = useLocation(); // ✅ FIXED

  useEffect(() => {
    const root = document.documentElement;

    // Reset first
    root.classList.remove("dark");

    if (dark) {
      root.classList.add("dark");
    }
  }, [dark]);

  const menu = [
    { name: "Dashboard", path: "/", icon: <FiHome /> },
    { name: "Orders", path: "/orders", icon: <FiShoppingCart /> },
    { name: "Customers", path: "/customers", icon: <FiUsers /> },
  ];

  return (
    <div className="flex min-h-screen bg-white dark:bg-black transition">

      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r shadow-sm hidden md:flex flex-col">
        
        <div className="p-6 text-xl font-bold text-indigo-600 dark:text-indigo-400">
          Retail Admin
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600"
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <header className="bg-white dark:bg-gray-800 border-b px-6 py-4 flex justify-between items-center shadow-sm">
          
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            {menu.find((m) => m.path === location.pathname)?.name || "Dashboard"}
          </h1>

          {/* Toggle Button */}
          <button
            onClick={() => setDark((prev) => !prev)}
            className="px-4 py-1 rounded-md border text-sm bg-gray-200 dark:bg-gray-700 dark:text-white transition"
          >
            {dark ? "Switch to Light" : "Switch to Dark"}
          </button>

        </header>

        {/* Animated Content */}
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 text-gray-800 dark:text-white"
        >
          {children}
        </motion.main>

      </div>
    </div>
  );
}

export default Layout;