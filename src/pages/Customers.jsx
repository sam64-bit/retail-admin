import { useEffect, useState } from "react";

import {
  fetchCustomers,
  addCustomer,
} from "../services/api";

function Customers() {

  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // ================= LOAD CUSTOMERS =================

  const loadCustomers = async () => {

    try {

      const data = await fetchCustomers();

      if (Array.isArray(data)) {
        setCustomers(data);
      } else {
        setCustomers([]);
      }

    } catch (error) {

      console.error(
        "API ERROR:",
        error
      );

      setCustomers([]);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // ================= ADD CUSTOMER =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await addCustomer(form);

      // Reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      // Reload customers
      loadCustomers();

    } catch (error) {
      console.error(error);
    }
  };

  // ================= SEARCH FILTER =================

  const filtered = customers.filter(
    (customer) =>
      customer.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
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

      {/* ================= ADD CUSTOMER FORM ================= */}

      <div className="bg-[#111827] border border-gray-800 rounded-3xl p-8 shadow-2xl">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-2xl font-bold text-white">
              Add Customer
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Create a new customer profile
            </p>

          </div>

          <div className="text-5xl opacity-20">
            👤
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          {/* Name */}
          <input
            type="text"
            placeholder="Customer Name"
            className="bg-[#1F2937] border border-gray-700 text-white placeholder-gray-400 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            className="bg-[#1F2937] border border-gray-700 text-white placeholder-gray-400 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            required
          />

          {/* Phone */}
          <input
            type="tel"
            placeholder="Phone Number"
            maxLength={10}
            pattern="[0-9]{10}"
            className="bg-[#1F2937] border border-gray-700 text-white placeholder-gray-400 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.phone}
            onChange={(e) => {

              // Allow only numbers
              const value =
                e.target.value.replace(
                  /\D/g,
                  ""
                );

              // Max 10 digits
              if (value.length <= 10) {

                setForm({
                  ...form,
                  phone: value,
                });

              }

            }}
            required
          />

          {/* Address */}
          <input
            type="text"
            placeholder="Customer Address"
            className="bg-[#1F2937] border border-gray-700 text-white placeholder-gray-400 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
            required
          />

          {/* Submit */}
          <button
            type="submit"
            className="md:col-span-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg shadow-indigo-500/20"
          >
            Add Customer
          </button>

        </form>

      </div>

      {/* ================= SEARCH ================= */}

      <div className="flex justify-end">

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

      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="p-6 border-b border-gray-800">

          <h2 className="text-xl font-bold text-white">
            Customer Records
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Total Customers: {filtered.length}
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-[#1F2937] text-gray-300 text-sm uppercase tracking-wider">

              <tr>

                <th className="p-5">
                  Customer
                </th>

                <th className="p-5">
                  Email
                </th>

                <th className="p-5">
                  Phone
                </th>

                <th className="p-5">
                  Address
                </th>

              </tr>

            </thead>

            <tbody>

              {paginated.map((customer) => (

                <tr
                  key={customer.id}
                  className="border-t border-gray-800 hover:bg-[#1F2937] transition-all duration-200"
                >

                  {/* Customer */}
                  <td className="p-5">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white">
                        {customer.name?.charAt(0)}
                      </div>

                      <div>

                        <p className="font-semibold text-white">
                          {customer.name}
                        </p>

                        <p className="text-sm text-gray-400">
                          Customer ID #{customer.id}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* Email */}
                  <td className="p-5 text-gray-300">
                    {customer.email}
                  </td>

                  {/* Phone */}
                  <td className="p-5 text-gray-300">
                    {customer.phone}
                  </td>

                  {/* Address */}
                  <td className="p-5 text-gray-300">
                    {customer.address}
                  </td>

                </tr>

              ))}

              {paginated.length === 0 && (

                <tr>

                  <td
                    colSpan="4"
                    className="text-center p-10 text-gray-500"
                  >
                    No customers found
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
          Showing {paginated.length} of {filtered.length} customers
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

    </div>
  );
}

export default Customers;