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

// Tooltip components (giữ nguyên)
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

// 👇 QUAN TRỌNG: Nhận props year và setYear từ cha (Dashboard)
export default function AdminRevenuePanel({ year, setYear }) { 
  // ❌ Đã xóa state nội bộ: const [selectedYear, setSelectedYear] = ...

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

  const effectiveIsMobile = isPrinting ? false : isMobile;

  // Fetch dữ liệu dựa trên prop 'year'
  const fetchRevenueData = useCallback(async () => {
    setLoading(true);
    try {
      // 👇 Sử dụng biến 'year' từ props
      const [r1, r2, r3, r4] = await Promise.all([
        fetch(makeUrl(`/api/orders/admin/revenue-monthly?year=${year}`), { headers: { "Content-Type": "application/json", ...getAuthHeaders() } }),
        fetch(makeUrl(`/api/orders/admin/revenue-by-product?year=${year}&limit=10`), { headers: { "Content-Type": "application/json", ...getAuthHeaders() } }),
        fetch(makeUrl(`/api/orders/admin/statistics/status-distribution?year=${year}`), { headers: { "Content-Type": "application/json", ...getAuthHeaders() } }),
        fetch(makeUrl(`/api/orders/admin/statistics/user-growth?year=${year}`), { headers: { "Content-Type": "application/json", ...getAuthHeaders() } })
      ]);

      const j1 = await r1.json(); const j2 = await r2.json(); const j3 = await r3.json(); const j4 = await r4.json();

      setMonthly(j1.data.map((x) => ({ month: String(x.month), total: Number(x.total || 0), count: Number(x.count || 0) })));
      setByProduct(j2.data.map((x) => ({ displayName: `${x.productCode || "(N/A)"} - ${x.productName || "(Không tên)"}`, total: Number(x.total || 0) })));
      setStatusData(j3.data);
      setUserData(j4.data.map((x) => ({ monthName: `Tháng ${x.month}`, count: Number(x.count || 0) })));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [year]); // 👇 Dependency là 'year' props

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className={styles.mainTitle} style={{ margin: 0, fontSize: '20px' }}>Bảng Thống Kê</h2>
        <div className={styles.filter}>
          {/* 👇 Sử dụng props year và hàm setYear để cập nhật lên cha */}
          <select 
            value={year} 
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', cursor: 'pointer' }}
          >
            <option value="2023">Năm 2023</option>
            <option value="2024">Năm 2024</option>
            <option value="2025">Năm 2025</option>
            <option value="2026">Năm 2026</option>
          </select>
        </div>
      </div>

      {isMobile && (
        <div className={styles.mobileWarning}>
          ⚠️ Khuyến nghị in báo cáo trên <b>Máy tính</b> (hoặc xoay ngang điện thoại) để đảm bảo hiển thị chính xác nhất.
        </div>
      )}

      {/* 1. CHART DOANH THU */}
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.title}>Tổng quan Doanh thu</div>
          <div className={styles.subtle}>Dữ liệu năm {year}</div> {/* Hiển thị năm từ props */}
        </div>
        {!loading && monthly.length > 0 ? (
          <div className={styles.chartBox}>
            <ResponsiveContainer>
              <ComposedChart data={monthly} margin={{ top: 16, right: 0, left: 10, bottom: 8 }}>
                <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray={isPrinting ? "" : "3 3"} />
                <XAxis dataKey="month" tick={{ fontSize: effectiveIsMobile ? 10 : 12, fill: isPrinting ? "#000" : "#6b7280" }} tickLine={false} axisLine={{ stroke: isPrinting ? "#000" : "#e5e7eb" }} />
                <YAxis yAxisId="left" width={45} tickFormatter={(val) => `${(val/1000000).toFixed(0)}M`} tick={{ fontSize: effectiveIsMobile ? 10 : 12, fill: isPrinting ? "#000" : "#6b7280" }} tickLine={false} axisLine={{ stroke: isPrinting ? "#000" : "#e5e7eb" }} />
                <YAxis yAxisId="right" orientation="right" width={effectiveIsMobile ? 24 : 30} tick={{ fontSize: effectiveIsMobile ? 10 : 12, fill: isPrinting ? "#000" : "#f97316" }} tickLine={false} axisLine={{ stroke: isPrinting ? "#000" : "#e5e7eb" }} />
                {!isPrinting && <Tooltip content={<RevenueTip />} cursor={{ fill: "rgba(59,130,246,0.06)" }} />}
                <Legend verticalAlign="top" height={effectiveIsMobile ? 24 : 36} wrapperStyle={{ fontSize: effectiveIsMobile ? 11 : 12, color: isPrinting ? "#000" : "#333" }}/>
                <Bar dataKey="total" name="Doanh thu" fill="url(#revGrad)" radius={[4, 4, 0, 0]} barSize={isPrinting ? 50 : (effectiveIsMobile ? 12 : 26)} yAxisId="left" isAnimationActive={false} />
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopOpacity="1" stopColor="#3b82f6" />
                    <stop offset="100%" stopOpacity="1" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
                <Line type="monotone" dataKey="count" name="Số đơn" stroke="#f97316" strokeWidth={isPrinting ? 3 : 2} yAxisId="right" isAnimationActive={false} dot={{ r: isPrinting ? 5 : 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : <div className={styles.empty}>{loading ? "Đang tải…" : "Chưa có doanh thu."}</div>}
      </div>

      {/* 2. CHART TOP SẢN PHẨM */}
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.title}>{effectiveIsMobile ? "Top 5 Sản phẩm" : "Top 10 Sản phẩm Doanh thu cao"}</div>
          <div className={styles.subtle}>Dữ liệu năm {year}</div>
        </div>
        {!loading && byProduct.length > 0 ? (
          <div className={styles.chartBox}>
            <ResponsiveContainer>
              <BarChart data={effectiveIsMobile ? byProduct.slice(0, 5) : byProduct} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid horizontal={false} stroke="#e5e7eb" strokeDasharray={isPrinting ? "" : "3 3"}/>
                <XAxis type="number" hide />
                <YAxis dataKey="displayName" type="category" width={effectiveIsMobile ? 100 : 250} tick={{ fontSize: effectiveIsMobile ? 10 : 11, fill: isPrinting ? "#000" : "#111827", fontWeight: isPrinting ? "bold" : "normal" }} tickLine={false} axisLine={false} tickFormatter={(value) => effectiveIsMobile ? value.split("-")[0] : (value.length > 40 ? `${value.substring(0, 40)}...` : value)} />
                {!isPrinting && <Tooltip content={<RevenueTip />} cursor={{ fill: "rgba(59,130,246,0.06)" }} />}
                <Bar dataKey="total" name="Doanh thu" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={isPrinting ? 25 : 18} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : <div className={styles.empty}>{loading ? "Đang tải…" : "Chưa có dữ liệu."}</div>}
      </div>

      {/* 3. CHART USER */}
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.title}>Tăng trưởng người dùng</div>
          <div className={styles.subtle}>Dữ liệu năm {year}</div>
        </div>
        {!loading && userData.length > 0 ? (
          <div className={styles.chartBox}>
            <ResponsiveContainer>
              <LineChart data={userData} margin={{ top: 16, right: 24, left: 16, bottom: 8 }}>
                <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray={isPrinting ? "" : "3 3"}/>
                <XAxis dataKey="monthName" tick={{ fontSize: effectiveIsMobile ? 10 : 12, fill: isPrinting ? "#000" : "#6b7280" }} tickLine={false} axisLine={{ stroke: isPrinting ? "#000" : "#e5e7eb" }} />
                <YAxis width={30} tick={{ fontSize: 12, fill: isPrinting ? "#000" : "#6b7280" }} tickLine={false} axisLine={{ stroke: isPrinting ? "#000" : "#e5e7eb" }} />
                {!isPrinting && <Tooltip content={<UserTip />} cursor={{ fill: "rgba(139,92,246,0.06)" }} /> }
                <Legend wrapperStyle={{ fontSize: effectiveIsMobile ? 11 : 12, color: isPrinting ? "#000" : "#333" }} />
                <Line type="monotone" dataKey="count" name="Người dùng mới" stroke="#8b5cf6" strokeWidth={isPrinting ? 3 : 2} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : <div className={styles.empty}>{loading ? "Đang tải…" : "Chưa có dữ liệu."}</div>}
      </div>

      {/* 4. CHART TRẠNG THÁI */}
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.title}>Phân bổ Trạng thái</div>
          <div className={styles.subtle}>Dữ liệu năm {year}</div>
        </div>
        {!loading && statusData.length > 0 ? (
          <div className={styles.chartBox} style={{ height: "300px" }}>
            <ResponsiveContainer>
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie data={statusData} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} label={!effectiveIsMobile ? renderCustomizedLabel : null} labelLine={!effectiveIsMobile} isAnimationActive={false}>
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