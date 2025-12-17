// // import React, { useEffect, useState, useCallback } from "react"; // SỬA ĐỔI: Thêm useCallback
// // import {
// //   BarChart, Bar, XAxis, YAxis, Tooltip,
// //   CartesianGrid, ResponsiveContainer
// // } from "recharts";
// // import styles from "./AdminRevenuePanel.module.css";
// // import socket from "../utils/socket-io.js"; // THÊM MỚI: Import socket

// // const API_BASE = (process.env.REACT_APP_BACKEND_API || process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");
// // const makeUrl = (p) => (API_BASE ? `${API_BASE}${p}` : p);
// // const getAuthHeaders = () => {
// //   const t = localStorage.getItem("token");
// //   return t ? { Authorization: `Bearer ${t}` } : {};
// // };
// // const fmtVND = (v) =>
// //   new Intl.NumberFormat("vi-VN")
// //     .format(Number(v) || 0)
// //     .replace(/,/g, ".") + " đ";

// // const Tip = ({ active, payload, label }) => {
// //   if (!active || !payload?.length) return null;
// //   const v = payload[0].value || 0;
// //   return (
// //     <div className={styles.tip}>
// //       <div>Tháng {label}</div>
// //       <div className={styles.tipVal}>{fmtVND(v)}</div>
// //     </div>
// //   );
// // };

// // export default function AdminRevenuePanel({ year = new Date().getFullYear() }) {
// //   const [monthly, setMonthly] = useState([]);
// //   const [byProduct, setByProduct] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   // SỬA ĐỔI: Bọc logic fetch vào trong useCallback
// //   // Hàm này sẽ được tạo lại khi 'year' thay đổi
// //   const fetchRevenueData = useCallback(async () => {
// //     setLoading(true);
// //     try {
// //       // doanh thu theo tháng
// //       const r1 = await fetch(makeUrl(`/api/orders/admin/revenue-monthly?year=${year}`), {
// //         headers: { "Content-Type": "application/json", ...getAuthHeaders() },
// //       });
// //       if (!r1.ok) throw new Error(await r1.text());
// //       const j1 = await r1.json();
// //       const m = j1.data.map((x) => ({
// //         month: String(x.month),
// //         total: Number(x.total || 0),
// //       }));

// //       // doanh thu theo mặt hàng
// //       const r2 = await fetch(makeUrl(`/api/orders/admin/revenue-by-product?year=${year}&limit=10`), {
// //         headers: { "Content-Type": "application/json", ...getAuthHeaders() },
// //       });
// //       if (!r2.ok) throw new Error(await r2.text());
// //       const j2 = await r2.json();
// //       const p = j2.data.map((x) => ({
// //         code: x.productCode || "(Chưa có mã)",
// //         name: x.productName || "(Không tên)",
// //         total: Number(x.total || 0),
// //       }));

// //       // Cập nhật state
// //       setMonthly(m);
// //       setByProduct(p);
// //     } catch (e) {
// //       setMonthly([]);
// //       setByProduct([]);
// //       console.error(e);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [year]); // Phụ thuộc vào 'year'

// //   // SỬA ĐỔI: useEffect này dùng để fetch data khi 'year' thay đổi
// //   useEffect(() => {
// //     fetchRevenueData();
// //   }, [fetchRevenueData]); // Phụ thuộc vào hàm fetchRevenueData

// //   // THÊM MỚI: useEffect này dùng để lắng nghe sự kiện socket
// //   useEffect(() => {
// //     const handleOrderUpdate = (data) => {
// //       const { action } = data;
// //       // Khi admin đổi trạng thái đơn (vd: Đã giao) hoặc user huỷ đơn
// //       if (action === "ADMIN_UPDATED_STATUS" || action === "USER_CANCELED") {
// //         console.log("Revenue Panel: Phát hiện thay đổi đơn hàng, tải lại dữ liệu doanh thu...");
// //         // Fetch lại dữ liệu doanh thu
// //         fetchRevenueData();
// //       }
// //     };

// //     // Đăng ký lắng nghe
// //     socket.on("order", handleOrderUpdate);

// //     // Dọn dẹp
// //     return () => {
// //       socket.off("order", handleOrderUpdate);
// //     };
// //   }, [fetchRevenueData]); // Phụ thuộc vào hàm fetchRevenueData để luôn gọi được hàm fetch mới nhất (khi year thay đổi)

// //   const maxProduct = Math.max(1, ...byProduct.map((x) => x.total));

// //   return (
// //     <div className={styles.wrap}>
// //       <div className={styles.card}>
// //         <div className={styles.header}>
// //           <div className={styles.title}>Doanh thu theo tháng</div>
// //           <div className={styles.subtle}>Năm {year}</div>
// //         </div>
// //         {loading && <div className={styles.empty}>Đang tải…</div>}
// //         {!loading && monthly.every((d) => d.total === 0) && (
// //           <div className={styles.empty}>Chưa có doanh thu trong năm này.</div>
// //         )}
// //         <div className={styles.chartBox}>
// //           <ResponsiveContainer>
// //             <BarChart
// //               data={monthly}
// //               margin={{ top: 16, right: 24, left: 16, bottom: 8 }}
// //               barCategoryGap={14}
// //             >
// //               <CartesianGrid vertical={false} stroke="#e5e7eb" />
// //               <XAxis
// //                 dataKey="month"
// //                 tick={{ fontSize: 12, fill: "#6b7280" }}
// //                 tickLine={false}
// //                 axisLine={{ stroke: "#e5e7eb" }}
// //               />
// //               <YAxis
// //                 width={70}
// //                 tickFormatter={fmtVND}
// //                 tick={{ fontSize: 12, fill: "#6b7280" }}
// //                 tickLine={false}
// //                 axisLine={{ stroke: "#e5e7eb" }}
// //               />
// //               <Tooltip content={<Tip />} cursor={{ fill: "rgba(59,130,246,0.06)" }} />
// //               <defs>
// //                 <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
// //                   <stop offset="0%" stopOpacity="1" stopColor="#3b82f6" />
// //                   <stop offset="100%" stopOpacity="1" stopColor="#22c55e" />
// //                 </linearGradient>
// //               </defs>
// //               <Bar dataKey="total" fill="url(#revGrad)" radius={[8, 8, 8, 8]} maxBarSize={26} />
// //             </BarChart>
// //           </ResponsiveContainer>
// //         </div>
// //       </div>

// //       <div className={styles.side}>
// //         <div className={styles.header}>
// //           <div className={styles.title}>Top doanh thu theo mặt hàng</div>
// //           <div className={styles.subtle}>Năm {year}</div>
// //         </div>
// //         {loading && <div className={styles.empty}>Đang tải…</div>}
// //         {!loading && byProduct.length === 0 && (
// //           <div className={styles.empty}>Chưa có dữ liệu.</div>
// //         )}
// //         <ul className={styles.list}>
// //           {byProduct.map((it, idx) => (
// //             <li key={idx} className={styles.item}>
// //               <div className={styles.row}>
// //                 <span className={styles.name} title={`${it.code} - ${it.name}`}>
// //                   {it.code} - {it.name}
// //                 </span>
// //                 <span className={styles.val}>{fmtVND(it.total)}</span>
// //               </div>
// //               <div className={styles.barTrack}>
// //                 <div
// //                   className={styles.barFill}
// //                   style={{ width: `${(it.total / maxProduct) * 100}%` }}
// //                 />
// //               </div>
// //             </li>
// //           ))}
// //         </ul>
// //       </div>
// //     </div>
// //   );
// // }

// // ===== FILE: AdminRevenuePanel.jsx (FIX LỖI NHÃN BỊ CHE) =====

// import React, { useEffect, useState, useCallback } from "react";
// import {
//   BarChart, Bar, LineChart, Line, PieChart, Pie, ComposedChart,
//   XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
//   Legend, Cell
// } from "recharts";
// import styles from "./AdminRevenuePanel.module.css";
// import socket from "../utils/socket-io.js";

// // Màu sắc cho Biểu đồ Tròn
// const PIE_COLORS = {
//   Pending: "#f59e0b", 
//   Shipping: "#3b82f6",
//   Delivered: "#22c55e",
//   Canceled: "#ef4444", 
//   Refunded: "#9ca3af",
//   "Waiting for progressing": "#581c87", // Màu tím đậm
// };

// // Hàm tiện ích
// const API_BASE = (process.env.REACT_APP_BACKEND_API || process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");
// const makeUrl = (p) => (API_BASE ? `${API_BASE}${p}` : p);
// const getAuthHeaders = () => {
//   const t = localStorage.getItem("token");
//   return t ? { Authorization: `Bearer ${t}` } : {};
// };
// const fmtVND = (v) =>
//   new Intl.NumberFormat("vi-VN")
//     .format(Number(v) || 0)
//     .replace(/,/g, ".") + " đ";

// // Tooltip thông minh
// const RevenueTip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   const data = payload[0].payload; 
//   const title = label || data.displayName; 
  
//   return (
//     <div className={styles.tip}>
//       <div>{title}</div>
//       {data.total != null && (
//         <div className={styles.tipVal}>{fmtVND(data.total)}</div>
//       )}
//       {data.count != null && (
//         <div className={styles.tipVal}>{data.count} đơn hàng</div>
//       )}
//     </div>
//   );
// };

// const UserTip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   const v = payload[0].value || 0;
//   return (
//     <div className={styles.tip}>
//       <div>{label}</div>
//       <div className={styles.tipVal}>{v} người dùng mới</div>
//     </div>
//   );
// };

// export default function AdminRevenuePanel({ year = new Date().getFullYear() }) {
//   const [monthly, setMonthly] = useState([]);
//   const [byProduct, setByProduct] = useState([]);
//   const [statusData, setStatusData] = useState([]);
//   const [userData, setUserData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchRevenueData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [r1, r2, r3, r4] = await Promise.all([
//         fetch(makeUrl(`/api/orders/admin/revenue-monthly?year=${year}`), {
//           headers: { "Content-Type": "application/json", ...getAuthHeaders() },
//         }),
//         fetch(makeUrl(`/api/orders/admin/revenue-by-product?year=${year}&limit=10`), {
//           headers: { "Content-Type": "application/json", ...getAuthHeaders() },
//         }),
//         fetch(makeUrl(`/api/orders/admin/statistics/status-distribution`), {
//           headers: { "Content-Type": "application/json", ...getAuthHeaders() },
//         }),
//         fetch(makeUrl(`/api/orders/admin/statistics/user-growth?year=${year}`), {
//           headers: { "Content-Type": "application/json", ...getAuthHeaders() },
//         })
//       ]);

//       const j1 = await r1.json();
//       const j2 = await r2.json();
//       const j3 = await r3.json();
//       const j4 = await r4.json();

//       setMonthly(j1.data.map((x) => ({
//         month: String(x.month),
//         total: Number(x.total || 0),
//         count: Number(x.count || 0)
//       })));
      
//       setByProduct(j2.data.map((x) => ({
//         displayName: `${x.productCode || "(N/A)"} - ${x.productName || "(Không tên)"}`,
//         total: Number(x.total || 0),
//       })));
      
//       setStatusData(j3.data);
      
//       setUserData(j4.data.map((x) => ({
//         monthName: `Tháng ${x.month}`,
//         count: Number(x.count || 0)
//       })));

//     } catch (e) {
//       setMonthly([]);
//       setByProduct([]);
//       setStatusData([]);
//       setUserData([]);
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   }, [year]);

//   useEffect(() => { fetchRevenueData(); }, [fetchRevenueData]);

//   useEffect(() => {
//     const handleUpdate = (data) => {
//       const { action } = data;
//       if (
//         ["ADMIN_UPDATED_STATUS", "USER_CANCELED", "NEW_ORDER"].includes(action) ||
//         action === "NEW_USER_SIGNUP"
//       ) {
//         console.log(`Panel Thống Kê: Phát hiện ${action}, tải lại dữ liệu...`);
//         fetchRevenueData();
//       }
//     };

//     socket.on("order", handleUpdate);
//     socket.on("user", handleUpdate); 

//     return () => {
//       socket.off("order", handleUpdate);
//       socket.off("user", handleUpdate); 
//     };
//   }, [fetchRevenueData]);

//   // Tùy chỉnh label cho Biểu đồ Tròn (để hiển thị % bên ngoài)
//   const RADIAN = Math.PI / 180;
//   const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, payload }) => {
//     const radius = outerRadius + 25; // Đẩy label ra xa
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);

//     return (
//       <text
//         x={x}
//         y={y}
//         fill="#6b7280" // Màu xám đậm
//         textAnchor={x > cx ? 'start' : 'end'}
//         dominantBaseline="central"
//         fontSize={12}
//       >
//         {`${payload.status} (${(percent * 100).toFixed(0)}%)`}
//       </text>
//     );
//   };


//   return (
//     <div className={styles.wrap}>
      
//       {/* 1. BIỂU ĐỒ KẾT HỢP DOANH THU & SỐ ĐƠN */}
//       <div className={styles.card}>
//         <div className={styles.header}>
//           <div className={styles.title}>Tổng quan Doanh thu (theo tháng)</div>
//           <div className={styles.subtle}>Năm {year}</div>
//         </div>
//         {loading && <div className={styles.empty}>Đang tải…</div>}
//         {!loading && monthly.every((d) => d.total === 0) && <div className={styles.empty}>Chưa có doanh thu trong năm này.</div>}
//         <div className={styles.chartBox}>
//           <ResponsiveContainer>
//             <ComposedChart data={monthly} margin={{ top: 16, right: 24, left: 16, bottom: 8 }}>
//               <CartesianGrid vertical={false} stroke="#e5e7eb" />
//               <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
//               <YAxis 
//                 yAxisId="left"
//                 width={70} 
//                 tickFormatter={fmtVND} 
//                 tick={{ fontSize: 12, fill: "#6b7280" }} 
//                 tickLine={false} 
//                 axisLine={{ stroke: "#e5e7eb" }} 
//               />
//               <YAxis 
//                 yAxisId="right"
//                 orientation="right"
//                 width={30}
//                 tick={{ fontSize: 12, fill: "#f97316" }} 
//                 tickLine={false} 
//                 axisLine={{ stroke: "#e5e7eb" }}
//               />
//               <Tooltip content={<RevenueTip />} cursor={{ fill: "rgba(59,130,246,0.06)" }} />
//               <Legend />
//               <defs>
//                 <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="0%" stopOpacity="1" stopColor="#3b82f6" />
//                   <stop offset="100%" stopOpacity="1" stopColor="#22c55e" />
//                 </linearGradient>
//               </defs>
//               <Bar dataKey="total" name="Doanh thu" fill="url(#revGrad)" radius={[8, 8, 8, 8]} maxBarSize={26} yAxisId="left" />
//               <Line type="monotone" dataKey="count" name="Số đơn hàng" stroke="#f97316" strokeWidth={2} yAxisId="right" />
//             </ComposedChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* 2. BIỂU ĐỒ CỘT NGANG TOP SẢN PHẨM */}
//       <div className={styles.card}>
//         <div className={styles.header}>
//           <div className={styles.title}>Top 10 Mặt hàng Doanh thu cao</div>
//           <div className={styles.subtle}>Năm {year}</div>
//         </div>
//         {loading && <div className={styles.empty}>Đang tải…</div>}
//         {!loading && byProduct.length === 0 && <div className={styles.empty}>Chưa có dữ liệu.</div>}
//         <div className={styles.chartBox}>
//           <ResponsiveContainer>
//             <BarChart 
//               data={byProduct} 
//               layout="vertical" 
//               margin={{ top: 5, right: 30, left: 20, bottom: 5 }} 
//             >
//               <CartesianGrid horizontal={false} stroke="#e5e7eb" />
//               <XAxis 
//                 type="number" 
//                 tickFormatter={fmtVND} 
//                 tick={{ fontSize: 10, fill: "#6b7280" }} 
//                 axisLine={{ stroke: "#e5e7eb" }} 
//               />
//               <YAxis 
//                 dataKey="displayName" 
//                 type="category" 
//                 tick={{ fontSize: 11, fill: "#111827" }} 
//                 tickLine={false} 
//                 axisLine={false}
//                 width={300} 
//                 tickFormatter={(value) => 
//                   (value && value.length > 45) ? `${value.substring(0, 45)}...` : value
//                 }
//               />
//               <Tooltip content={<RevenueTip />} cursor={{ fill: "rgba(59,130,246,0.06)" }} />
//               <Bar dataKey="total" name="Doanh thu" fill="#8884d8" radius={[0, 8, 8, 0]} maxBarSize={18} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* 3. BIỂU ĐỒ TĂNG TRƯỞNG USER */}
//       <div className={styles.card}>
//         <div className={styles.header}>
//           <div className={styles.title}>Tăng trưởng người dùng mới</div>
//           <div className={styles.subtle}>Năm {year}</div>
//         </div>
//         {loading && <div className={styles.empty}>Đang tải…</div>}
//         {!loading && userData.every((d) => d.count === 0) && <div className={styles.empty}>Chưa có người dùng mới trong năm này.</div>}
//         <div className={styles.chartBox}>
//           <ResponsiveContainer>
//             <LineChart data={userData} margin={{ top: 16, right: 24, left: 16, bottom: 8 }}>
//               <CartesianGrid vertical={false} stroke="#e5e7eb" />
//               <XAxis dataKey="monthName" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
//               <YAxis width={30} tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
//               <Tooltip content={<UserTip />} cursor={{ fill: "rgba(139,92,246,0.06)" }} />
//               <Legend />
//               <Line type="monotone" dataKey="count" name="Người dùng mới" stroke="#8b5cf6" strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* 4. BIỂU ĐỒ TRẠNG THÁI ĐƠN HÀNG (ĐÃ SỬA LỖI NHÃN) */}
//       <div className={styles.card}>
//         <div className={styles.header}>
//           <div className={styles.title}>Phân bổ Trạng thái Đơn hàng</div>
//           <div className={styles.subtle}>Toàn bộ thời gian</div>
//         </div>
//         {loading && <div className={styles.empty}>Đang tải…</div>}
//         {!loading && statusData.length === 0 && <div className={styles.empty}>Không có dữ liệu đơn hàng.</div>}
        
//         {/* Tăng chiều cao biểu đồ để có chỗ cho nhãn bên ngoài */}
//         <div className={styles.chartBox} style={{ height: "300px" }}>
//           <ResponsiveContainer>
//             <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
//               <Pie
//                 data={statusData}
//                 dataKey="count"
//                 nameKey="status"
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={70}
//                 outerRadius={100}
//                 paddingAngle={3}
//                 label={renderCustomizedLabel} 
//                 labelLine
//               >
//                 {statusData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.status] || "#8884d8"} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               {/* Legend tắt vì đã có label bên ngoài */}
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, ComposedChart,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  Legend, Cell
} from "recharts";
import styles from "./AdminRevenuePanel.module.css";
import socket from "../utils/socket-io.js";

const PIE_COLORS = {
  Pending: "#f59e0b", Shipping: "#3b82f6", Delivered: "#22c55e",
  Canceled: "#ef4444", Refunded: "#9ca3af", "Waiting for progressing": "#581c87",
};

const API_BASE = (process.env.REACT_APP_BACKEND_API || process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");
const makeUrl = (p) => (API_BASE ? `${API_BASE}${p}` : p);
const getAuthHeaders = () => {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
};
const fmtVND = (v) => new Intl.NumberFormat("vi-VN").format(Number(v) || 0).replace(/,/g, ".") + " đ";

// Tooltip (Chỉ hiện khi xem trên web)
const RevenueTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  const title = data.displayName || label;
  
  return (
    <div className={styles.tip}>
      <div>{title}</div>
      {data.total != null && <div className={styles.tipVal}>{fmtVND(data.total)}</div>}
      {data.count != null && <div className={styles.tipVal}>{data.count} đơn hàng</div>}
    </div>
  );
};

const UserTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const v = payload[0].value || 0;
  return (
    <div className={styles.tip}>
      <div>{label}</div>
      <div className={styles.tipVal}>{v} người dùng mới</div>
    </div>
  );
};

export default function AdminRevenuePanel({ year = new Date().getFullYear() }) {
  const [monthly, setMonthly] = useState([]);
  const [byProduct, setByProduct] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    const beforePrint = () => setIsPrinting(true);
    const afterPrint = () => setIsPrinting(false);

    window.addEventListener("resize", handleResize);
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

  // Vẫn giữ logic ép giao diện Desktop khi in để tối ưu nhất có thể
  const effectiveIsMobile = isPrinting ? false : isMobile;

  const fetchRevenueData = useCallback(async () => {
    setLoading(true);
    try {
      const [r1, r2, r3, r4] = await Promise.all([
        fetch(makeUrl(`/api/orders/admin/revenue-monthly?year=${year}`), { headers: { "Content-Type": "application/json", ...getAuthHeaders() } }),
        fetch(makeUrl(`/api/orders/admin/revenue-by-product?year=${year}&limit=10`), { headers: { "Content-Type": "application/json", ...getAuthHeaders() } }),
        fetch(makeUrl(`/api/orders/admin/statistics/status-distribution`), { headers: { "Content-Type": "application/json", ...getAuthHeaders() } }),
        fetch(makeUrl(`/api/orders/admin/statistics/user-growth?year=${year}`), { headers: { "Content-Type": "application/json", ...getAuthHeaders() } })
      ]);
      const j1 = await r1.json(); const j2 = await r2.json(); const j3 = await r3.json(); const j4 = await r4.json();
      setMonthly(j1.data.map((x) => ({ month: String(x.month), total: Number(x.total || 0), count: Number(x.count || 0) })));
      setByProduct(j2.data.map((x) => ({ displayName: `${x.productCode || "(N/A)"} - ${x.productName || "(Không tên)"}`, total: Number(x.total || 0) })));
      setStatusData(j3.data);
      setUserData(j4.data.map((x) => ({ monthName: `Tháng ${x.month}`, count: Number(x.count || 0) })));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [year]);

  useEffect(() => { fetchRevenueData(); }, [fetchRevenueData]);

  useEffect(() => {
    const handleUpdate = (data) => {
      if (["ADMIN_UPDATED_STATUS", "USER_CANCELED", "NEW_ORDER", "NEW_USER_SIGNUP"].includes(data.action)) fetchRevenueData();
    };
    socket.on("order", handleUpdate); socket.on("user", handleUpdate);
    return () => { socket.off("order", handleUpdate); socket.off("user", handleUpdate); };
  }, [fetchRevenueData]);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, payload }) => {
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill={isPrinting ? "#000" : "#6b7280"} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight={isPrinting ? "bold" : "normal"}>
        {`${payload.status} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className={styles.wrap}>

      {/* 👇 CODE BẠN YÊU CẦU: CẢNH BÁO TRÊN MOBILE 👇 */}
      {isMobile && (
        <div className={styles.mobileWarning}>
          ⚠️ Khuyến nghị in báo cáo trên <b>Máy tính</b> (hoặc xoay ngang điện thoại) để đảm bảo hiển thị chính xác nhất.
        </div>
      )}

      {/* 1. CHART DOANH THU & SỐ ĐƠN */}
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.title}>Tổng quan Doanh thu</div>
          <div className={styles.subtle}>Năm {year}</div>
        </div>
        {!loading && monthly.length > 0 ? (
          <div className={styles.chartBox}>
            <ResponsiveContainer>
              <ComposedChart data={monthly} margin={{ top: 16, right: 0, left: 10, bottom: 8 }}>
                <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray={isPrinting ? "" : "3 3"} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: effectiveIsMobile ? 10 : 12, fill: isPrinting ? "#000" : "#6b7280" }} 
                  tickLine={false} axisLine={{ stroke: isPrinting ? "#000" : "#e5e7eb" }} 
                />
                <YAxis 
                  yAxisId="left" width={45} 
                  tickFormatter={(val) => `${(val/1000000).toFixed(0)}M`} 
                  tick={{ fontSize: effectiveIsMobile ? 10 : 12, fill: isPrinting ? "#000" : "#6b7280" }} 
                  tickLine={false} axisLine={{ stroke: isPrinting ? "#000" : "#e5e7eb" }} 
                />
                <YAxis 
                  yAxisId="right" orientation="right" width={effectiveIsMobile ? 24 : 30}
                  tick={{ fontSize: effectiveIsMobile ? 10 : 12, fill: isPrinting ? "#000" : "#f97316" }} 
                  tickLine={false} axisLine={{ stroke: isPrinting ? "#000" : "#e5e7eb" }}
                />
                {!isPrinting && <Tooltip content={<RevenueTip />} cursor={{ fill: "rgba(59,130,246,0.06)" }} />}
                <Legend verticalAlign="top" height={effectiveIsMobile ? 24 : 36} wrapperStyle={{ fontSize: effectiveIsMobile ? 11 : 12, color: isPrinting ? "#000" : "#333" }}/>
                <Bar 
                  dataKey="total" name="Doanh thu" fill="url(#revGrad)" radius={[4, 4, 0, 0]} 
                  barSize={isPrinting ? 50 : (effectiveIsMobile ? 12 : 26)} 
                  yAxisId="left" isAnimationActive={false} 
                />
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopOpacity="1" stopColor="#3b82f6" />
                    <stop offset="100%" stopOpacity="1" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
                <Line 
                  type="monotone" dataKey="count" name="Số đơn" stroke="#f97316" strokeWidth={isPrinting ? 3 : 2} 
                  yAxisId="right" isAnimationActive={false} dot={{ r: isPrinting ? 5 : 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : <div className={styles.empty}>{loading ? "Đang tải…" : "Chưa có doanh thu."}</div>}
      </div>

      {/* 2. CHART TOP SẢN PHẨM */}
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.title}>{effectiveIsMobile ? "Top 5 Sản phẩm" : "Top 10 Sản phẩm Doanh thu cao"}</div>
          <div className={styles.subtle}>Năm {year}</div>
        </div>
        {!loading && byProduct.length > 0 ? (
          <div className={styles.chartBox}>
            <ResponsiveContainer>
              <BarChart 
                data={effectiveIsMobile ? byProduct.slice(0, 5) : byProduct} 
                layout="vertical" 
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }} 
              >
                <CartesianGrid horizontal={false} stroke="#e5e7eb" strokeDasharray={isPrinting ? "" : "3 3"}/>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="displayName" type="category" width={effectiveIsMobile ? 100 : 250} 
                  tick={{ fontSize: effectiveIsMobile ? 10 : 11, fill: isPrinting ? "#000" : "#111827", fontWeight: isPrinting ? "bold" : "normal" }} 
                  tickLine={false} axisLine={false}
                  tickFormatter={(value) => effectiveIsMobile ? value.split("-")[0] : (value.length > 40 ? `${value.substring(0, 40)}...` : value)}
                />
                {!isPrinting && <Tooltip content={<RevenueTip />} cursor={{ fill: "rgba(59,130,246,0.06)" }} />}
                <Bar 
                  dataKey="total" name="Doanh thu" fill="#8884d8" radius={[0, 4, 4, 0]} 
                  barSize={isPrinting ? 25 : 18} isAnimationActive={false} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : <div className={styles.empty}>{loading ? "Đang tải…" : "Chưa có dữ liệu."}</div>}
      </div>

      {/* 3. CHART USER GROWTH */}
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.title}>Tăng trưởng người dùng</div>
          <div className={styles.subtle}>Năm {year}</div>
        </div>
        {!loading && userData.length > 0 ? (
          <div className={styles.chartBox}>
            <ResponsiveContainer>
              <LineChart data={userData} margin={{ top: 16, right: 24, left: 16, bottom: 8 }}>
                <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray={isPrinting ? "" : "3 3"}/>
                <XAxis 
                  dataKey="monthName" 
                  tick={{ fontSize: effectiveIsMobile ? 10 : 12, fill: isPrinting ? "#000" : "#6b7280" }} 
                  tickLine={false} axisLine={{ stroke: isPrinting ? "#000" : "#e5e7eb" }} 
                />
                <YAxis width={30} tick={{ fontSize: 12, fill: isPrinting ? "#000" : "#6b7280" }} tickLine={false} axisLine={{ stroke: isPrinting ? "#000" : "#e5e7eb" }} />
                {!isPrinting && <Tooltip content={<UserTip />} cursor={{ fill: "rgba(139,92,246,0.06)" }} />}
                <Legend wrapperStyle={{ fontSize: effectiveIsMobile ? 11 : 12, color: isPrinting ? "#000" : "#333" }} />
                <Line 
                  type="monotone" dataKey="count" name="Người dùng mới" stroke="#8b5cf6" 
                  strokeWidth={isPrinting ? 3 : 2} isAnimationActive={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : <div className={styles.empty}>{loading ? "Đang tải…" : "Chưa có dữ liệu."}</div>}
      </div>

      {/* 4. CHART TRẠNG THÁI */}
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.title}>Phân bổ Trạng thái</div>
          <div className={styles.subtle}>Toàn thời gian</div>
        </div>
        {!loading && statusData.length > 0 ? (
          <div className={styles.chartBox} style={{ height: "300px" }}>
            <ResponsiveContainer>
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%" cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  label={!effectiveIsMobile ? renderCustomizedLabel : null} 
                  labelLine={!effectiveIsMobile}
                  isAnimationActive={false}
                >
                  {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.status] || "#8884d8"} />)}
                </Pie>
                {!isPrinting && <Tooltip />}
                {(effectiveIsMobile || isPrinting) && <Legend layout="horizontal" verticalAlign="bottom" iconSize={10} wrapperStyle={{fontSize: '11px', color: isPrinting ? '#000' : '#333'}} />}
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : <div className={styles.empty}>{loading ? "Đang tải…" : "Không có dữ liệu."}</div>}
      </div>
    </div>
  );
}