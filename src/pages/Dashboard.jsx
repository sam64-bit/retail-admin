import { useEffect, useState } from "react";

import {
  fetchDashboardStats,
  fetchOrders,
} from "../services/api";

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
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

function Dashboard() {

  const [stats, setStats] = useState(null);

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    Promise.all([
      fetchDashboardStats(),
      fetchOrders(),
    ])

      .then(([statsData, ordersRes]) => {

        setStats(statsData);

        setOrders(ordersRes?.data || []);

        setLoading(false);
      })

      .catch((err) => {

        console.error(
          "Dashboard error:",
          err
        );

        setLoading(false);
      });

  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-white text-lg">
        Loading dashboard...
      </div>
    );
  }

  // =========================
  // TOP CUSTOMERS
  // =========================

  const customerMap = {};

  orders.forEach((o) => {
    customerMap[o.customer] =
      (customerMap[o.customer] || 0) + 1;
  });

  const topCustomersData =
    Object.entries(customerMap)

      .map(([name, count]) => ({
        name,
        orders: count,
      }))

      .sort((a, b) =>
        b.orders - a.orders
      )

      .slice(0, 5);

  // =========================
  // ORDER STATUS
  // =========================

  const statusMap = {
    Pending: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  orders.forEach((o) => {
    statusMap[o.status]++;
  });

  const pieData = Object.keys(
    statusMap
  ).map((key) => ({
    name: key,
    value: statusMap[key],
  }));

  const COLORS = [
    "#F59E0B",
    "#22C55E",
    "#EF4444",
  ];

  // =========================
  // MONTHLY REVENUE
  // =========================

  const monthlyMap = {};

  orders.forEach((o) => {

    const month =
      o.date?.slice(0, 7) || "Unknown";

    const amount = Number(
      String(o.amount)
        .replace("$", "")
        .replace(",", "")
    );

    monthlyMap[month] =
      (monthlyMap[month] || 0) + amount;
  });

  const revenueTrend =
    Object.entries(monthlyMap)

      .map(([month, sales]) => ({
        month,
        revenue: sales,
      }));

  // =========================
  // DAILY ORDERS
  // =========================

  const dailyMap = {};

  orders.forEach((o) => {

    const day =
      o.date || "Unknown";

    dailyMap[day] =
      (dailyMap[day] || 0) + 1;
  });

  const dailyOrdersData =
    Object.entries(dailyMap)

      .map(([date, count]) => ({
        date,
        orders: count,
      }))

      .slice(-7);

  return (
    <div className="space-y-8">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Orders */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-7 shadow-2xl shadow-indigo-500/20">

          <div className="flex justify-between items-start">

            <div>

              <p className="text-indigo-200 text-sm">
                Total Orders
              </p>

              <h2 className="text-5xl font-bold text-white mt-3">
                {stats?.totalOrders}
              </h2>

              <p className="text-indigo-200 text-sm mt-4">
                +12% this month
              </p>

            </div>

            <div className="text-6xl opacity-20">
              📦
            </div>

          </div>

        </div>

        {/* Revenue */}
        <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-3xl p-7 shadow-2xl shadow-cyan-500/20">

          <div className="flex justify-between items-start">

            <div>

              <p className="text-cyan-200 text-sm">
                Revenue
              </p>

              <h2 className="text-5xl font-bold text-white mt-3">
                {stats?.revenue}
              </h2>

              <p className="text-cyan-200 text-sm mt-4">
                +8% growth
              </p>

            </div>

            <div className="text-6xl opacity-20">
              💰
            </div>

          </div>

        </div>

        {/* Customers */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-7 shadow-2xl shadow-emerald-500/20">

          <div className="flex justify-between items-start">

            <div>

              <p className="text-emerald-200 text-sm">
                Customers
              </p>

              <h2 className="text-5xl font-bold text-white mt-3">
                {stats?.customers}
              </h2>

              <p className="text-emerald-200 text-sm mt-4">
                +5 today
              </p>

            </div>

            <div className="text-6xl opacity-20">
              👥
            </div>

          </div>

        </div>

      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Revenue Growth */}
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 shadow-2xl">

          <h2 className="text-xl font-bold text-white mb-6">
            Revenue Growth
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart
              data={revenueTrend}
            >

              <CartesianGrid
                stroke="#374151"
              />

              <XAxis
                dataKey="month"
                stroke="#9CA3AF"
              />

              <YAxis
                stroke="#9CA3AF"
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6366F1"
                strokeWidth={4}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* Order Status */}
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 shadow-2xl">

          <h2 className="text-xl font-bold text-white mb-6">
            Order Status
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                label
              >

                {pieData.map(
                  (_, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[index]
                      }
                    />
                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Daily Orders */}
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 shadow-2xl">

          <h2 className="text-xl font-bold text-white mb-6">
            Daily Orders
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <AreaChart
              data={dailyOrdersData}
            >

              <defs>

                <linearGradient
                  id="orders"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="5%"
                    stopColor="#06B6D4"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#06B6D4"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>

              <CartesianGrid
                stroke="#374151"
              />

              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
              />

             <YAxis
  stroke="#9CA3AF"
  allowDecimals={false}
/>

              <Tooltip />

              <Area
                type="monotone"
                dataKey="orders"
                stroke="#06B6D4"
                fillOpacity={1}
                fill="url(#orders)"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

        {/* Top Customers */}
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 shadow-2xl">

          <h2 className="text-xl font-bold text-white mb-6">
            Top Customers
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={topCustomersData}
            >

              <CartesianGrid
                stroke="#374151"
              />

              <XAxis
                dataKey="name"
                stroke="#9CA3AF"
              />

              <YAxis
                stroke="#9CA3AF"
              />

              <Tooltip />

              <Bar
                dataKey="orders"
                fill="#8B5CF6"
                radius={[10, 10, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Recent Orders */}
      <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">

        <div className="p-6 border-b border-gray-800">

          <h2 className="text-xl font-bold text-white">
            Recent Orders
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Latest customer orders
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-[#1F2937] text-gray-300 uppercase text-sm">

              <tr>

                <th className="p-5">
                  Order ID
                </th>

                <th className="p-5">
                  Customer
                </th>

                <th className="p-5">
                  Status
                </th>

                <th className="p-5">
                  Amount
                </th>

              </tr>

            </thead>

            <tbody>

              {orders
                .slice(0, 5)
                .map((order) => (

                  <tr
                    key={order.id}
                    className="border-t border-gray-800 hover:bg-[#1F2937]"
                  >

                    <td className="p-5 text-indigo-400 font-semibold">
                      #{order.id}
                    </td>

                    <td className="p-5 text-white">
                      {order.customer}
                    </td>

                    <td className="p-5">

                      <span
                        className={`
                          px-3 py-1 rounded-full text-sm font-medium

                          ${
                            order.status ===
                            "Pending"

                              ? "bg-yellow-500/20 text-yellow-400"

                              : order.status ===
                                "Delivered"

                              ? "bg-green-500/20 text-green-400"

                              : "bg-red-500/20 text-red-400"
                          }
                        `}
                      >
                        {order.status}
                      </span>

                    </td>

                    <td className="p-5 text-emerald-400 font-semibold">
                      {order.amount}
                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;