import axios from "axios";

const API = "http://localhost:8080/api";


// ================= CUSTOMERS =================

export const fetchCustomers = async () => {
  const res = await axios.get(`${API}/customers`);
  return res.data;
};

export const addCustomer = async (customer) => {
  const res = await axios.post(
    `${API}/customers`,
    customer
  );

  return res.data;
};


// ================= ORDERS =================

export const fetchOrders = async () => {
  const res = await axios.get(`${API}/orders`);

  return {
    data: res.data,
    total: res.data.length,
  };
};

export const addOrder = async (order) => {
  const res = await axios.post(
    `${API}/orders`,
    order
  );

  return res.data;
};
export const updateOrderStatus = async (
  id,
  status
) => {

  const res = await axios.put(
    `${API}/orders/${id}/status?status=${status}`
  );

  return res.data;
};


// ================= DASHBOARD =================

export const fetchDashboardStats = async () => {
  const customers = await fetchCustomers();
  const ordersRes = await fetchOrders();

  // Calculate revenue from orders
  const revenue = ordersRes.data.reduce(
    (total, order) => {

      const cleanAmount = String(order.amount)
        .replace("$", "")
        .replace(",", "");

      return total + Number(cleanAmount || 0);

    },
    0
  );

  return {
    totalOrders: ordersRes.total,
    revenue: `$${revenue.toLocaleString()}`,
    customers: customers.length,
  };
};