import { useEffect, useState } from "react";

import Badge from "../components/ui/Badge";

import {
  fetchOrders,
  addOrder,
  fetchCustomers,
  updateOrderStatus,
} from "../services/api";

function Orders() {

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  // ================= FORM =================

  const [form, setForm] = useState({
    customer: "",
    status: "Pending",
    amount: "",
    product: "",
    address: "",
    date: "",
  });

  // ================= LOAD DATA =================

  const loadData = async () => {

    try {

      setLoading(true);

      const [ordersRes, customersRes] =
        await Promise.all([
          fetchOrders(),
          fetchCustomers(),
        ]);

      setOrders(ordersRes.data || []);
      setCustomers(customersRes || []);

      setLoading(false);

    } catch (error) {

      console.error(error);

      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= AUTO ADDRESS =================

  const handleCustomerChange = (
    customerName
  ) => {

    const customer = customers.find(
      (c) => c.name === customerName
    );

    setForm({
      ...form,
      customer: customerName,
      address: customer?.address || "",
    });
  };

  // ================= ADD ORDER =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await addOrder(form);

      setForm({
        customer: "",
        status: "Pending",
        amount: "",
        product: "",
        address: "",
        date: "",
      });

      loadData();

    } catch (error) {
      console.error(error);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="text-center p-10 text-white text-lg">
        Loading orders...
      </div>
    );
  }

  // ================= FILTER =================

  const filtered = orders

    .filter((o) =>
      o.customer
        ?.toLowerCase()
        .includes(search.toLowerCase())
    )

    .filter((o) =>
      status === "All"
        ? true
        : o.status === status
    );

  // ================= PAGINATION =================

  const start =
    (page - 1) * itemsPerPage;

  const paginated = filtered.slice(
    start,
    start + itemsPerPage
  );

  const totalPages = Math.ceil(
    filtered.length / itemsPerPage
  );

  return (
    <div className="space-y-8">

      {/* ================= ADD ORDER ================= */}

      <div className="bg-[#111827] border border-gray-800 rounded-3xl p-8 shadow-2xl">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-2xl font-bold text-white">
              Add Order
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Create and manage orders
            </p>

          </div>

          <div className="text-5xl opacity-20">
            📦
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          {/* Customer */}
          <select
            className="bg-[#1F2937] border border-gray-700 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.customer}
            onChange={(e) =>
              handleCustomerChange(
                e.target.value
              )
            }
            required
          >

            <option value="">
              Select Customer
            </option>

            {customers.map((customer) => (

              <option
                key={customer.id}
                value={customer.name}
              >
                {customer.name}
              </option>

            ))}

          </select>

          {/* Status */}
          <select
            className="bg-[#1F2937] border border-gray-700 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value,
              })
            }
          >
            <option>Pending</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>

          {/* Amount */}
          <input
            type="text"
            placeholder="Amount"
            className="bg-[#1F2937] border border-gray-700 text-white placeholder-gray-400 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.amount}
            onChange={(e) =>
              setForm({
                ...form,
                amount: e.target.value,
              })
            }
            required
          />

          {/* Product */}
          <input
            type="text"
            placeholder="Product Name"
            className="bg-[#1F2937] border border-gray-700 text-white placeholder-gray-400 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.product}
            onChange={(e) =>
              setForm({
                ...form,
                product: e.target.value,
              })
            }
          />

          {/* Address */}
          <input
            type="text"
            placeholder="Address"
            className="bg-[#1F2937] border border-gray-700 text-gray-300 p-4 rounded-2xl"
            value={form.address}
            readOnly
          />

          {/* Date */}
          <input
            type="date"
            className="bg-[#1F2937] border border-gray-700 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.date}
            onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value,
              })
            }
          />

          {/* Submit */}
          <button
            type="submit"
            className="md:col-span-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg shadow-indigo-500/20"
          >
            Add Order
          </button>

        </form>

      </div>

      {/* ================= FILTERS ================= */}

      <div className="flex justify-end gap-4 flex-wrap">

        {/* Search */}
        <input
          type="text"
          placeholder="Search customer..."
          className="bg-[#111827] border border-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* Filter */}
        <select
          className="bg-[#111827] border border-gray-700 text-white px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>

      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">

        <div className="p-6 border-b border-gray-800">

          <h2 className="text-xl font-bold text-white">
            Order Records
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Total Orders: {filtered.length}
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-[#1F2937] text-gray-300 uppercase text-sm tracking-wider">

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

              {paginated.map((order) => (

                <tr
                  key={order.id}
                  className="border-t border-gray-800 hover:bg-[#1F2937] transition-all duration-200"
                >

                  {/* Order ID */}
                  <td
                    className="p-5 text-indigo-400 font-semibold cursor-pointer hover:text-cyan-400"
                    onClick={() =>
                      setSelectedOrder(order)
                    }
                  >
                    #{order.id}
                  </td>

                  {/* Customer */}
                  <td className="p-5 text-white">
                    {order.customer}
                  </td>

                  {/* Status */}
                  <td className="p-5">
                    <Badge status={order.status} />
                  </td>

                  {/* Amount */}
                  <td className="p-5 text-gray-300">
                    {order.amount}
                  </td>

                </tr>

              ))}

              {paginated.length === 0 && (

                <tr>

                  <td
                    colSpan="4"
                    className="text-center p-10 text-gray-500"
                  >
                    No orders found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= PAGINATION ================= */}

      <div className="flex justify-between items-center">

        <p className="text-sm text-gray-400">
          Showing {paginated.length} of {filtered.length} orders
        </p>

        <div className="flex gap-3">

          <button
            className="px-5 py-2 rounded-2xl bg-[#111827] border border-gray-700 text-white disabled:opacity-40 hover:bg-[#1F2937]"
            disabled={page === 1}
            onClick={() =>
              setPage(page - 1)
            }
          >
            Prev
          </button>

          <div className="px-5 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold">
            {page}
          </div>

          <button
            className="px-5 py-2 rounded-2xl bg-[#111827] border border-gray-700 text-white disabled:opacity-40 hover:bg-[#1F2937]"
            disabled={page === totalPages}
            onClick={() =>
              setPage(page + 1)
            }
          >
            Next
          </button>

        </div>

      </div>

      {/* ================= DRAWER ================= */}

      {selectedOrder && (

        <div className="fixed top-0 right-0 w-[420px] h-full bg-[#111827] border-l border-gray-800 shadow-2xl p-8 z-50 overflow-y-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">

            <div>

              <h2 className="text-2xl font-bold text-white">
                Order Details
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                Detailed order information
              </p>

            </div>

            <button
              onClick={() =>
                setSelectedOrder(null)
              }
              className="w-10 h-10 rounded-xl bg-[#1F2937] text-gray-300 hover:bg-red-500 hover:text-white transition"
            >
              ✕
            </button>

          </div>

          {/* Details */}
          <div className="space-y-6">

            <div className="bg-[#1F2937] p-5 rounded-2xl">

              <p className="text-gray-400 text-sm">
                Order ID
              </p>

              <h3 className="text-xl font-bold text-indigo-400 mt-1">
                #{selectedOrder.id}
              </h3>

            </div>

            <div className="bg-[#1F2937] p-5 rounded-2xl">

              <p className="text-gray-400 text-sm">
                Customer
              </p>

              <h3 className="text-lg font-semibold text-white mt-1">
                {selectedOrder.customer}
              </h3>

            </div>

            <div className="bg-[#1F2937] p-5 rounded-2xl">

              <p className="text-gray-400 text-sm mb-2">
                Status
              </p>

              <Badge status={selectedOrder.status} />

            </div>

            <div className="bg-[#1F2937] p-5 rounded-2xl">

              <p className="text-gray-400 text-sm">
                Amount
              </p>

              <h3 className="text-2xl font-bold text-emerald-400 mt-1">
                {selectedOrder.amount}
              </h3>

            </div>

            <div className="bg-[#1F2937] p-5 rounded-2xl">

              <p className="text-gray-400 text-sm">
                Product
              </p>

              <h3 className="text-white mt-1">
                {selectedOrder.product}
              </h3>

            </div>

            <div className="bg-[#1F2937] p-5 rounded-2xl">

              <p className="text-gray-400 text-sm">
                Delivery Address
              </p>

              <h3 className="text-white mt-1">
                {selectedOrder.address}
              </h3>

            </div>

            <div className="bg-[#1F2937] p-5 rounded-2xl">

              <p className="text-gray-400 text-sm">
                Order Date
              </p>

              <h3 className="text-white mt-1">
                {selectedOrder.date}
              </h3>

            </div>

            {/* Status Update Buttons */}
{selectedOrder.status ===
  "Pending" && (

  <div className="grid grid-cols-2 gap-4">

    {/* Delivered */}
    <button
      onClick={async () => {

        try {

          await updateOrderStatus(
            selectedOrder.id,
            "Delivered"
          );

          await loadData();

          setSelectedOrder({
            ...selectedOrder,
            status: "Delivered",
          });

        } catch (error) {
          console.error(error);
        }

      }}
      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-green-500/20"
    >
      Deliver
    </button>

    {/* Cancel */}
    <button
      onClick={async () => {

        try {

          await updateOrderStatus(
            selectedOrder.id,
            "Cancelled"
          );

          await loadData();

          setSelectedOrder({
            ...selectedOrder,
            status: "Cancelled",
          });

        } catch (error) {
          console.error(error);
        }

      }}
      className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-red-500/20"
    >
      Cancel
    </button>

  </div>

)}

          </div>

        </div>

      )}

    </div>
  );
}

export default Orders;