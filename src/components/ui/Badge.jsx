function Badge({ status }) {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-600",
    Delivered: "bg-green-100 text-green-600",
    Cancelled: "bg-red-100 text-red-600",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded ${styles[status]}`}>
      {status}
    </span>
  );
}

export default Badge;