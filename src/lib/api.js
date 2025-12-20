// 👇 Sửa cổng 5000 này thành cổng server của bạn nếu khác
const DOMAIN = "http://localhost:5000"; 

export async function getAllOrders() {
  const token = localStorage.getItem("token"); 

  // Gọi vào route admin/all mà ta vừa thêm bên Server
  const response = await fetch(`${DOMAIN}/api/orders/admin/all`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token, 
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Không thể lấy danh sách đơn hàng.');
  }

  return data.orders || [];
}