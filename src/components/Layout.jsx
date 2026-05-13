import {
  FiHome,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";

import {
  Link,
  useLocation,
} from "react-router-dom";

import { motion } from "framer-motion";

function Layout({ children }) {

  const location = useLocation();

  const menu = [
    {
      name: "Dashboard",
      path: "/",
      icon: <FiHome />,
    },
    {
      name: "Orders",
      path: "/orders",
      icon: <FiShoppingCart />,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: <FiUsers />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-white">

      {/* Sidebar */}
      <aside className="w-72 bg-[#111827] border-r border-gray-800 shadow-2xl hidden md:flex flex-col">

        {/* Logo */}
        <div className="p-7 border-b border-gray-800">

          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Retail Admin
          </h1>

          

        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-3">

          {menu.map((item) => {

            const isActive =
              location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group

                  ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/30"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }
                `}
              >

                <span className="text-2xl">
                  {item.icon}
                </span>

                <span className="font-medium text-lg">
                  {item.name}
                </span>

              </Link>
            );
          })}

        </nav>

       

      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Navbar */}
        <header className="h-20 bg-[#111827]/90 backdrop-blur-lg border-b border-gray-800 flex items-center justify-between px-8">

          <div>

            <h2 className="text-2xl font-bold">
              {
                menu.find(
                  (m) =>
                    m.path === location.pathname
                )?.name
              }
            </h2>

            <p className="text-sm text-gray-400">
              Welcome back, Admin
            </p>

          </div>

          {/* Right */}
<div className="text-sm text-gray-400">
  Retail Management System
</div>
        </header>

        {/* Page Content */}
        <motion.main
          key={location.pathname}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="flex-1 overflow-y-auto p-8 bg-[#0F172A]"
        >

          {children}

        </motion.main>

      </div>

    </div>
  );
}

export default Layout;