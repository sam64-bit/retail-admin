import { useEffect, useState } from "react";
import { fetchOrders } from "../services/api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // 🔥 helper generators
  const generateEmail = (name) =>
    name.toLowerCase().replace(" ", "") + "@gmail.com";

  const generatePhone = (index) =>
    "+91 98" + (10000000 + index).toString().slice(0, 8);

  const generateAddress = (index) => {
    const cities = ["Bangalore", "Chennai", "Mumbai", "Delhi", "Hyderabad"];
    return `${index + 12}, ${cities[index % cities.length]}, India`;
  };

  const generateAvatar = (name) =>
    `https://ui-avatars.com/api/?name=${name}&background=4F46E5&color=fff`;

  useEffect(() => {
    fetchOrders(1, 100).then((res) => {
      const orders = res.data;

      const map = {};

      orders.forEach((o, index) => {
        if (!map[o.customer]) {
          map[o.customer] = {
            name: o.customer,
            email: generateEmail(o.customer),
            phone: generatePhone(index),
            address: generateAddress(index),
            avatar: generateAvatar(o.customer),
            totalOrders: 0,
            totalSpent: 0,
            orders: [],
          };
        }

        map[o.customer].totalOrders += 1;
        map[o.customer].totalSpent += Number(o.amount.replace("$", ""));
        map[o.customer].orders.push(o);
      });

      setCustomers(Object.values(map));
    });
  }, []);

  return (
    <div className="space-y-6">

      {/* Customer List */}
      <div className="bg-white rounded-xl shadow">
        <h2 className="p-4 font-semibold">Customers</h2>

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Total Spent</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c) => (
              <tr
                key={c.name}
                onClick={() => setSelectedCustomer(c)}
                className="border-t cursor-pointer hover:bg-gray-50"
              >
                <td className="p-4">{c.name}</td>
                <td className="p-4">{c.totalOrders}</td>
                <td className="p-4">${c.totalSpent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Details */}
      {selectedCustomer && (
        <div className="bg-white p-6 rounded-xl shadow space-y-6">

          {/* Profile */}
          <div className="flex items-center gap-6">
            <img
              src={selectedCustomer.avatar}
              alt="profile"
              className="w-16 h-16 rounded-full"
            />

            <div>
              <h2 className="text-xl font-semibold">
                {selectedCustomer.name}
              </h2>
              <p className="text-gray-500">{selectedCustomer.email}</p>
              <p className="text-gray-500">{selectedCustomer.phone}</p>
              <p className="text-gray-500">{selectedCustomer.address}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Orders</p>
              <h2 className="text-xl font-bold">
                {selectedCustomer.totalOrders}
              </h2>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Spent</p>
              <h2 className="text-xl font-bold">
                ${selectedCustomer.totalSpent}
              </h2>
            </div>
          </div>

          {/* Orders */}
          <div>
            <h3 className="font-semibold mb-3">Order History</h3>

            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm">
                <tr>
                  <th className="p-3">ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {selectedCustomer.orders.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="p-3">{o.id}</td>
                    <td>{o.date}</td>
                    <td>{o.amount}</td>
                    <td>{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => setSelectedCustomer(null)}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default Customers;