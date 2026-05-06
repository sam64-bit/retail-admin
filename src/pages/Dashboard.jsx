import { useEffect, useState } from "react";
import { fetchDashboardStats, fetchOrders } from "../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDashboardStats(), fetchOrders(1, 100)])
      .then(([statsData, ordersRes]) => {
        setStats(statsData);
        setOrders(ordersRes?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Loading dashboard...</div>;
  }

  // =========================
  // 📈 LINE CHART (Top Customers)
  // =========================
  const customerMap = {};

  orders.forEach((o) => {
    customerMap[o.customer] = (customerMap[o.customer] || 0) + 1;
  });

  const lineData = Object.entries(customerMap)
    .map(([name, count]) => ({ name, orders: count }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5); // 🔥 Top 5 only

  // =========================
  // 🥧 PIE CHART (Status)
  // =========================
  const statusMap = {
    Pending: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  orders.forEach((o) => {
    statusMap[o.status]++;
  });

  const pieData = Object.keys(statusMap).map((key) => ({
    name: key,
    value: statusMap[key],
  }));

  const COLORS = ["#F59E0B", "#22C55E", "#EF4444"];

  return (
    <div className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-5 rounded-xl shadow">
          <p className="text-sm opacity-80">Total Orders</p>
          <h2 className="text-2xl font-bold">{stats?.totalOrders}</h2>
        </div>

        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-5 rounded-xl shadow">
          <p className="text-sm opacity-80">Revenue</p>
          <h2 className="text-2xl font-bold">{stats?.revenue}</h2>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-xl shadow">
          <p className="text-sm opacity-80">Customers</p>
          <h2 className="text-2xl font-bold">{stats?.customers}</h2>
        </div>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Line Chart */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Top Customers (Orders)</h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#4F46E5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Order Status</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={80}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Recent Orders */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

        <table className="w-full text-left">
          <thead className="bg-indigo-50 text-indigo-600 text-sm">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Status</th>
              <th className="p-4">Amount</th>
            </tr>
          </thead>

          <tbody>
            {orders.slice(0, 5).map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-4">{order.id}</td>
                <td className="p-4">{order.customer}</td>
                <td className="p-4">{order.status}</td>
                <td className="p-4">{order.amount}</td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

    </div>
  );
}

export default Dashboard;