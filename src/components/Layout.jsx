import { FiHome, FiShoppingCart, FiUsers } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

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

      {/* Main */}
      <div className="flex-1 flex flex-col">
        
        {/* Navbar */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
          
          <h1 className="text-lg font-semibold text-gray-800">
            {menu.find((m) => m.path === location.pathname)?.name || "Dashboard"}
          </h1>

          <div className="flex items-center gap-4">
            
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Profile */}
            <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"></div>
          </div>

        </header>

        {/* Content */}
        <main className="p-6">
          {children}
        </main>

      </div>
    </div>
  );
}

export default Layout;