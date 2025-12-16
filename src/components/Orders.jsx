// // ===== FILE: Orders.js (Component của Admin) =====

// import React, { useEffect, useState } from "react";
// import classes from "./Orders.module.css";
// import { Link } from "react-router-dom";
// import socket from "../utils/socket-io.js";

// const API_BASE = (process.env.REACT_APP_BACKEND_API || process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");
// const makeUrl = (path) => (API_BASE ? `${API_BASE}${path}` : path);

// const getAuthHeaders = () => {
//   const token = localStorage.getItem("token");
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// const DELIVERY_OPTIONS = [
//   { value: "Waiting for progressing", label: "Chưa vận chuyển" },
//   { value: "Shipping", label: "Đang giao" },
//   { value: "Delivered", label: "Đã giao" },
//   { value: "Canceled", label: "Đã huỷ" },
// ];

// const DELIVERY_COLORS = {
//   "Waiting for progressing": "#facc15", // vàng nhạt
//   Shipping: "#38bdf8", // xanh dương nhạt
//   Delivered: "#4ade80", // xanh lá nhạt
//   Canceled: "#f87171", // đỏ nhạt
// };

// const PAYMENT_COLORS = {
//   "Waiting for pay": "#facc15", // vàng nhạt
//   Paid: "#4ade80", // xanh lá nhạt
//   Refunded: "#94a3b8", // xám nhạt
// };

// const PAYMENT_OPTIONS = [
//   { value: "Waiting for pay", label: "Chưa thanh toán" },
//   { value: "Paid", label: "Đã thanh toán" },
//   { value: "Refunded", label: "Hoàn tiền" },
// ];

// const PAGE_SIZE = 4; // 4 hoặc 5

// const Orders = ({ orders = [], onSaved }) => {
//   const [rows, setRows] = useState([]);
//   const [page, setPage] = useState(1);

//   // Đồng bộ props.orders vào state rows
//   useEffect(() => {
//     setRows(
//       orders.map((o) => ({
//         ...o,
//         _delivery: o.deliveryStatus,
//         _payment: o.paymentStatus,
//         _saving: false,
//       }))
//     );
//     setPage(1);
//   }, [orders]);

//   // Lắng nghe socket để cập nhật realtime
//   // useEffect(() => {
//   //   const handleOrderUpdate = (data) => {
//   //     const { action, order } = data;

//   //     if (action === "ADMIN_UPDATED_STATUS" || action === "USER_CANCELED") {
//   //       console.log("Admin Dashboard: Socket received update:", action, order);

//   //       setRows((prevRows) =>
//   //         prevRows.map((r) =>
//   //           r._id === order._id
//   //             ? {
//   //                 ...r,
//   //                 ...order,
//   //                 _delivery: order.deliveryStatus,
//   //                 _payment: order.paymentStatus,
//   //               }
//   //             : r
//   //         )
//   //       );

//   //       onSaved?.(order);
//   //     }
//   //   };

//   //   socket.on("order", handleOrderUpdate);
//   //   return () => {
//   //     socket.off("order", handleOrderUpdate);
//   //   };
//   // }, [onSaved]);
//   useEffect(() => {
//     const handleOrderUpdate = (data) => {
//       const { action, order } = data;

//       if (action === "NEW_ORDER") {
//         console.log("Admin Dashboard: Socket received NEW order:", order);
//         const newRow = {
//           ...order,
//           _delivery: order.deliveryStatus,
//           _payment: order.paymentStatus,
//           _saving: false,
//         };
//         setRows((prevRows) => [newRow, ...prevRows]);
//         onSaved?.(order);
//         return;
//       }

//       if (action === "ADMIN_UPDATED_STATUS" || action === "USER_CANCELED") {
//         console.log("Admin Dashboard: Socket received update:", action, order);
//         setRows((prevRows) =>
//           prevRows.map((r) =>
//             r._id === order._id
//               ? {
//                   ...r,
//                   ...order,
//                   _delivery: order.deliveryStatus,
//                   _payment: order.paymentStatus,
//                 }
//               : r
//           )
//         );
//         onSaved?.(order);
//       }
//     };

//     socket.on("order", handleOrderUpdate);
//     return () => {
//       socket.off("order", handleOrderUpdate);
//     };
//   }, [onSaved]);

//   const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
//   const pagedRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const formatDateTime = (v) =>
//     v
//       ? new Date(v).toLocaleString("vi-VN", {
//           day: "2-digit",
//           month: "2-digit",
//           year: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "—";

//   const formatVND = (n) =>
//     new Intl.NumberFormat("vi-VN").format(Number(n || 0)) + " đ";

//   // Hàm lưu trạng thái đơn hàng
//   const saveRow = async (row) => {
//     try {
//       setRows((prev) =>
//         prev.map((r) => (r._id === row._id ? { ...r, _saving: true } : r))
//       );

//       const url = makeUrl(`/api/orders/admin/${row._id}/status`);
//       const res = await fetch(url, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           ...getAuthHeaders(),
//         },
//         body: JSON.stringify({
//           paymentStatus: row._payment,
//           deliveryStatus: row._delivery,
//         }),
//       });

//       if (!res.ok) throw new Error();
//       const data = await res.json();

//       setRows((prev) =>
//         prev.map((r) =>
//           r._id === row._id
//             ? {
//                 ...r,
//                 paymentStatus: data.order.paymentStatus,
//                 deliveryStatus: data.order.deliveryStatus,
//                 _payment: data.order.paymentStatus,
//                 _delivery: data.order.deliveryStatus,
//                 _saving: false,
//               }
//             : r
//         )
//       );

//       onSaved?.(data.order);
//     } catch {
//       setRows((prev) =>
//         prev.map((r) =>
//           r._id === row._id ? { ...r, _saving: false } : r
//         )
//       );
//       alert("Có lỗi khi cập nhật trạng thái.");
//     }
//   };

//   const applyAndSave = (order, patch) => {
//     const next = { ...order, ...patch };
//     setRows((prev) => prev.map((r) => (r._id === order._id ? next : r)));
//     saveRow(next);
//   };

//   return (
//     <div className={classes.orders}>
//       <h3>Lịch sử đơn hàng</h3>

//       <div className={classes.tableWrap}>
//         <table>
//           <thead>
//             <tr>
//               <th>ID Người dùng</th>
//               <th>Tên</th>
//               <th>SĐT</th>
//               <th>Địa chỉ</th>
//               <th>Ngày đặt</th>
//               <th>Tổng tiền</th>
//               <th>Vận chuyển</th>
//               <th>Thanh toán</th>
//               <th className={classes.narrow}>Chi tiết</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pagedRows.map((order, i) => (
//               <tr key={order._id} className={i % 2 === 0 ? classes.gray : ""}>
//                 <td>{order.userId?._id}</td>
//                 <td>{order.userId?.fullName}</td>
//                 <td>{order.userId?.phoneNumber}</td>
//                 <td className={classes.address}>{order.userId?.address}</td>
//                 <td>{formatDateTime(order.createdAt)}</td>
//                 <td>{formatVND(order.totalPrice)}</td>

//                 <td>
//                   <select
//                     className="status-select"
//                     style={{ backgroundColor: DELIVERY_COLORS[order._delivery] }}
//                     value={order._delivery}
//                     onChange={(e) =>
//                       applyAndSave(order, { _delivery: e.target.value })
//                     }
//                   >
//                     {DELIVERY_OPTIONS.map((opt) => (
//                       <option key={opt.value} value={opt.value}>
//                         {opt.label}
//                       </option>
//                     ))}
//                   </select>
//                 </td>

//                 <td>
//                   <select
//                     className="status-select"
//                     style={{ backgroundColor: PAYMENT_COLORS[order._payment] }}
//                     value={order._payment}
//                     onChange={(e) =>
//                       applyAndSave(order, { _payment: e.target.value })
//                     }
//                   >
//                     {PAYMENT_OPTIONS.map((opt) => (
//                       <option key={opt.value} value={opt.value}>
//                         {opt.label}
//                       </option>
//                     ))}
//                   </select>
//                 </td>

//                 <td className={classes.actions}>
//                   <Link to={`/${order._id}`}>Xem</Link>
//                 </td>
//               </tr>
//             ))}

//             {pagedRows.length === 0 && (
//               <tr>
//                 <td colSpan="9">Không có đơn hàng nào</td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         <div className={classes.simplePager}>
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//             <button
//               key={p}
//               onClick={() => setPage(p)}
//               className={p === page ? classes.activePage : ""}
//             >
//               {p}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Orders;

// ===== FILE: Orders.js (ĐÃ LÀM SẠCH) =====

import React, { useEffect, useState } from "react";
import classes from "./Orders.module.css";
import { Link } from "react-router-dom";
import socket from "../utils/socket-io.js";

const API_BASE = (process.env.REACT_APP_BACKEND_API || process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");
const makeUrl = (path) => (API_BASE ? `${API_BASE}${path}` : path);

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const DELIVERY_OPTIONS = [
  { value: "Waiting for progressing", label: "Chưa vận chuyển" },
  { value: "Shipping", label: "Đang giao" },
  { value: "Delivered", label: "Đã giao" },
  { value: "Canceled", label: "Đã huỷ" },
];
const DELIVERY_COLORS = {
  "Waiting for progressing": "#facc15",
  Shipping: "#38bdf8",
  Delivered: "#4ade80",
  Canceled: "#f87171",
};
const PAYMENT_COLORS = {
  "Waiting for pay": "#facc15",
  Paid: "#4ade80",
  Refunded: "#94a3b8",
};
const PAYMENT_OPTIONS = [
  { value: "Waiting for pay", label: "Chưa thanh toán" },
  { value: "Paid", label: "Đã thanh toán" },
  { value: "Refunded", label: "Hoàn tiền" },
];

const Orders = ({ orders = [], onSaved }) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(
      orders.map((o) => ({
        ...o,
        _delivery: o.deliveryStatus,
        _payment: o.paymentStatus,
        _saving: false,
      }))
    );
  }, [orders]);

  useEffect(() => {
    const handleOrderUpdate = (data) => {
      const { action, order } = data;

      if (action === "NEW_ORDER") {
        const newRow = {
          ...order,
          _delivery: order.deliveryStatus,
          _payment: order.paymentStatus,
          _saving: false,
        };
        setRows((prevRows) => [newRow, ...prevRows]);
        onSaved?.(order);
        return;
      }

      if (action === "ADMIN_UPDATED_STATUS" || action === "USER_CANCELED") {
        setRows((prevRows) =>
          prevRows.map((r) =>
            r._id === order._id
              ? {
                  ...r,
                  ...order,
                  _delivery: order.deliveryStatus,
                  _payment: order.paymentStatus,
                }
              : r
          )
        );
        onSaved?.(order);
      }
    };

    socket.on("order", handleOrderUpdate);
    return () => {
      socket.off("order", handleOrderUpdate);
    };
  }, [onSaved]);

  const formatDateTime = (v) =>
    v
      ? new Date(v).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const formatVND = (n) =>
    new Intl.NumberFormat("vi-VN").format(Number(n || 0)) + " đ";

  const saveRow = async (row) => {
    try {
      setRows((prev) =>
        prev.map((r) => (r._id === row._id ? { ...r, _saving: true } : r))
      );

      const url = makeUrl(`/api/orders/admin/${row._id}/status`);
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          paymentStatus: row._payment,
          deliveryStatus: row._delivery,
        }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();

      setRows((prev) =>
        prev.map((r) =>
          r._id === row._id
            ? {
                ...r,
                paymentStatus: data.order.paymentStatus,
                deliveryStatus: data.order.deliveryStatus,
                _payment: data.order.paymentStatus,
                _delivery: data.order.deliveryStatus,
                _saving: false,
              }
            : r
        )
      );

      onSaved?.(data.order);
    } catch {
      setRows((prev) =>
        prev.map((r) => (r._id === row._id ? { ...r, _saving: false } : r))
      );
      alert("Có lỗi khi cập nhật trạng thái.");
    }
  };

  const applyAndSave = (order, patch) => {
    const next = { ...order, ...patch };
    setRows((prev) => prev.map((r) => (r._id === order._id ? next : r)));
    saveRow(next);
  };

  return (
    <div className={classes.orders}>
      <h3>Lịch sử đơn hàng</h3>

      <div className={classes.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>ID Người dùng</th>
              <th>Tên</th>
              <th>SĐT</th>
              <th>Địa chỉ</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Vận chuyển</th>
              <th>Thanh toán</th>
              <th className={classes.narrow}>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order, i) => (
              <tr key={order._id} className={i % 2 === 0 ? classes.gray : ""}>
                <td>{order.userId?._id}</td>
                <td>{order.userId?.fullName}</td>
                <td>{order.userId?.phoneNumber}</td>
                <td className={classes.address}>{order.address}</td>
                <td>{formatDateTime(order.createdAt)}</td>
                <td>{formatVND(order.totalPrice)}</td>
                <td>
                  <select
                    className="status-select"
                    style={{ backgroundColor: DELIVERY_COLORS[order._delivery], opacity: order._saving ? 0.7 : 1 }}
                    value={order._delivery}
                    disabled={order._saving}
                    onChange={(e) => applyAndSave(order, { _delivery: e.target.value })}
                  >
                    {DELIVERY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="status-select"
                    style={{ backgroundColor: PAYMENT_COLORS[order._payment], opacity: order._saving ? 0.7 : 1 }}
                    value={order._payment}
                    disabled={order._saving}
                    onChange={(e) => applyAndSave(order, { _payment: e.target.value })}
                  >
                    {PAYMENT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className={classes.actions}>
                  <Link to={`/${order._id}`}>Xem</Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan="9">Không có đơn hàng nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
