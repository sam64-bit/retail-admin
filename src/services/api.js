// Simulate API delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Orders API
export const fetchOrders = async () => {
  await delay(800);
  return [
    { id: "#1001", customer: "John", status: "Pending", amount: "$120" },
    { id: "#1002", customer: "Alice", status: "Delivered", amount: "$250" },
    { id: "#1003", customer: "Bob", status: "Cancelled", amount: "$80" },
    { id: "#1004", customer: "Sam", status: "Pending", amount: "$140" },
    { id: "#1005", customer: "David", status: "Delivered", amount: "$300" },
  ];
};

// Dashboard stats API
export const fetchDashboardStats = async () => {
  await delay(600);
  return {
    totalOrders: 1240,
    revenue: "$32,400",
    customers: 860,
  };
};