const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const names = ["John", "Alice", "Bob", "Sam", "David"];
const statuses = ["Pending", "Delivered", "Cancelled"];

const products = ["Laptop", "Phone", "Headphones", "Shoes", "Watch"];
const cities = ["Chennai", "Bangalore", "Mumbai", "Delhi", "Hyderabad"];

const generateOrders = () => {
  const orders = [];

  for (let i = 1; i <= 100; i++) {
    orders.push({
      id: `#${1000 + i}`,
      customer: names[Math.floor(Math.random() * names.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      amount: `$${Math.floor(Math.random() * 500 + 50)}`,

      // 🔥 NEW FIELDS
      product: products[Math.floor(Math.random() * products.length)],
      address: cities[Math.floor(Math.random() * cities.length)],
      date: new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ).toISOString().split("T")[0],
    });
  }

  return orders;
};

const allOrders = generateOrders();

export const fetchOrders = async (page = 1, limit = 10) => {
  await delay(500);

  const start = (page - 1) * limit;

  return {
    data: allOrders.slice(start, start + limit),
    total: allOrders.length,
  };
};

export const fetchDashboardStats = async () => {
  await delay(400);

  return {
    totalOrders: allOrders.length,
    revenue: "$32,400",
    customers: 860,
  };
};