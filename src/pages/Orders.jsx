import { useEffect, useState } from "react";
import Badge from "../components/ui/Badge";
import { fetchOrders } from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // 🔥 Fetch ALL data once
  useEffect(() => {
    setLoading(true);

    fetchOrders(1, 100).then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center p-10 text-lg">Loading orders...</div>;
  }

  // 🔍 Global filter (ALL data)
  const filtered = orders
    .filter((o) =>
      o.customer.toLowerCase().includes(search.toLowerCase())
    )
    .filter((o) => (status === "All" ? true : o.status === status));

  // 📄 Pagination AFTER filter
  const start = (page - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-2xl font-semibold">Orders</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search customer..."
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset page
            }}
          />

          <select
            className="border px-3 py-2 rounded-lg"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1); // reset page
            }}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
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
            {paginated.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">

                {/* Clickable ID */}
                <td
                  className="p-4 text-indigo-600 font-medium cursor-pointer hover:underline"
                  onClick={() => setSelectedOrder(order)}
                >
                  {order.id}
                </td>

                <td className="p-4">{order.customer}</td>

                <td className="p-4">
                  <Badge status={order.status} />
                </td>

                <td className="p-4">{order.amount}</td>

              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages || 1}
        </p>

        <div className="flex gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Drawer */}
      {selectedOrder && (
        <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg p-6 z-50 overflow-y-auto">

          <h2 className="text-xl font-semibold mb-6">Order Details</h2>

          <div className="space-y-3 text-sm">

            <p><strong>ID:</strong> {selectedOrder.id}</p>
            <p><strong>Customer:</strong> {selectedOrder.customer}</p>

            <p>
              <strong>Status:</strong>
              <span className="ml-2">
                <Badge status={selectedOrder.status} />
              </span>
            </p>

            <p><strong>Amount:</strong> {selectedOrder.amount}</p>

            <hr className="my-3" />

            <p><strong>Product:</strong> {selectedOrder.product}</p>
            <p><strong>Delivery Address:</strong> {selectedOrder.address}</p>
            <p><strong>Order Date:</strong> {selectedOrder.date}</p>

          </div>

          <button
            onClick={() => setSelectedOrder(null)}
            className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Close
          </button>

        </div>
      )}

    </div>
  );
}

export default Orders;