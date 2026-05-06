import { FiHome, FiShoppingCart, FiUsers } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Layout({ children }) {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/", icon: <FiHome /> },
    { name: "Orders", path: "/orders", icon: <FiShoppingCart /> },
    { name: "Customers", path: "/customers", icon: <FiUsers /> },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col">
        
        <div className="p-6 text-xl font-bold text-indigo-600">
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
                      : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content ONLY (no header now) */}
      <div className="flex-1">

        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {children}
        </motion.main>

      </div>
    </div>
  );
}

export default Layout;