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
  const itemsPerPage = 3;

  // Fetch data
  useEffect(() => {
    fetchOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  // Loading state
  if (loading) {
    return <div className="text-center p-10 text-lg">Loading orders...</div>;
  }

  // Filter logic
  const filtered = orders
    .filter((o) =>
      o.customer.toLowerCase().includes(search.toLowerCase())
    )
    .filter((o) => (status === "All" ? true : o.status === status));

  // Pagination logic
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
            className="border px-3 py-2 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border px-3 py-2 rounded-lg"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1); // reset page on filter change
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
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Status</th>
              <th className="p-4">Amount</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((order) => (
              <tr
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="border-t hover:bg-gray-50 cursor-pointer"
              >
                <td className="p-4">{order.id}</td>
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
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-5 z-50">
          <h2 className="text-lg font-semibold mb-4">Order Details</h2>

          <p><strong>ID:</strong> {selectedOrder.id}</p>
          <p><strong>Customer:</strong> {selectedOrder.customer}</p>
          <p><strong>Status:</strong> {selectedOrder.status}</p>
          <p><strong>Amount:</strong> {selectedOrder.amount}</p>

          <button
            onClick={() => setSelectedOrder(null)}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default Orders;