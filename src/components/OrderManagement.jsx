// ===== TẠO FILE MỚI: src/pages/admin/OrderManagement.jsx =====

import React, { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import classes from "./Dashboard.module.css"; // Dùng chung CSS với Dashboard
import orderClasses from "./OrderManagement.module.css"; // CSS riêng cho phân trang
import Orders from "./Orders"; // Component table của bạn
import Pagination from "./Pagination"; // Component Pagination đã tạo

const ITEMS_PER_PAGE = 10; // 10 đơn hàng mỗi trang

const OrderManagement = ({ orders = [], isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Hàm Xuất Excel (Di chuyển từ Dashboard về đây)
  const handleExportExcel = () => {
    if (isLoading || !orders || orders.length === 0) {
      alert("Chưa có dữ liệu đơn hàng để xuất!");
      return;
    }
    // ... (Toàn bộ logic Excel của bạn giữ nguyên) ...
    const dataForExcel = orders.map((order) => ({
      "Mã Đơn Hàng": order._id,
      "Tên Khách Hàng": order.userId?.fullName || "N/A",
      "Số Điện Thoại": order.userId?.phoneNumber || "N/A",
      "Địa Chỉ": order.address || "",
      "Tổng Tiền": order.totalPrice,
      "Trạng thái Giao hàng": order.deliveryStatus,
      "Trạng thái Thanh toán": order.paymentStatus,
      "Ngày Đặt": new Date(order.createdAt).toLocaleString("vi-VN"),
    }));
    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    ws["!cols"] = [
      { wch: 30 }, { wch: 25 }, { wch: 15 }, { wch: 40 },
      { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DonHang");
    const fileName = `Bao_cao_don_hang_${new Date().toLocaleDateString(
      "vi-VN"
    )}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Logic Lọc và Phân trang (Giống Products, Users)
  const filteredOrders = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase().trim();
    if (!lowerCaseSearch) {
      return orders;
    }
    return orders.filter((order) =>
      (order.userId?.fullName?.toLowerCase().includes(lowerCaseSearch)) ||
      (order.userId?.phoneNumber?.toLowerCase().includes(lowerCaseSearch)) ||
      (order._id?.toLowerCase().includes(lowerCaseSearch))
    );
  }, [orders, searchTerm]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className={classes.dashboard}>
      {/* Header của trang Quản lý Đơn hàng */}
      <div className={classes.dashboardHeader}>
        <h4>Quản lý Đơn hàng</h4>
        <div className={classes.buttonGroup}>
          <button
            onClick={handleExportExcel}
            className={classes.excelButton}
            disabled={isLoading}
          >
            📊 Xuất Excel (Toàn bộ Đơn hàng)
          </button>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className={orderClasses.filters}>
        <input
          type="text"
          placeholder="Tìm theo Tên, SĐT, hoặc Mã đơn hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading && <p>Đang tải đơn hàng...</p>}
      
      {!isLoading && filteredOrders.length === 0 && (
        <p>{searchTerm ? "Không tìm thấy đơn hàng phù hợp." : "Chưa có đơn hàng nào."}</p>
      )}

      {/* Bảng Đơn hàng (đã phân trang) */}
      {!isLoading && paginatedOrders.length > 0 && (
        <>
          <Orders orders={paginatedOrders} />
          
          {/* Phân trang */}
          {totalPages > 1 && (
            <div className={orderClasses.paginationContainer}>
              <p className={orderClasses.totalCount}>
                Hiển thị {paginatedOrders.length} trên tổng số {filteredOrders.length} đơn hàng
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                classes={orderClasses} // Dùng CSS riêng
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderManagement;