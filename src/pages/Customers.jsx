const customer = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+91 9876543210",
  totalOrders: 5,
  totalSpent: "$890",
};

const orders = [
  { id: "#1001", date: "2024-05-01", amount: "$120", status: "Pending" },
  { id: "#1002", date: "2024-05-03", amount: "$250", status: "Delivered" },
  { id: "#1003", date: "2024-05-05", amount: "$80", status: "Cancelled" },
];

function Customers() {
  const getStatusColor = (status) => {
    if (status === "Pending") return "bg-yellow-100 text-yellow-600";
    if (status === "Delivered") return "bg-green-100 text-green-600";
    if (status === "Cancelled") return "bg-red-100 text-red-600";
  };

  return (
    <div className="space-y-6">

      {/* Profile Card */}
      <div className="bg-white p-6 rounded-xl shadow flex items-center gap-6">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>

        <div>
          <h2 className="text-xl font-semibold">{customer.name}</h2>
          <p className="text-gray-500">{customer.email}</p>
          <p className="text-gray-500">{customer.phone}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h2 className="text-2xl font-bold">{customer.totalOrders}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Spent</p>
          <h2 className="text-2xl font-bold">{customer.totalSpent}</h2>
        </div>

      </div>

      {/* Order History */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <h2 className="p-4 font-semibold">Order History</h2>

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Date</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-4">{order.id}</td>
                <td className="p-4">{order.date}</td>
                <td className="p-4">{order.amount}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}

export default Customers;