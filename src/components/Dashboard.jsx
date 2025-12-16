

// // // ===== FILE: src/pages/admin/Dashboard.jsx =====

// // import React, { useRef } from "react";
// // import { useReactToPrint } from "react-to-print";
// // import * as XLSX from "xlsx";
// // import classes from "./Dashboard.module.css";
// // import OrdersBoard from "./OrdersBoard";
// // import Orders from "./Orders";
// // import AdminRevenuePanel from "../components/AdminRevenuePanel";

// // const Dashboard = ({ orders, statistic, isLoading }) => {
// //   const reportRef = useRef();

// //   const handlePrint = useReactToPrint({
// //     contentRef: reportRef, // ✅ DÙNG prop contentRef thay vì content: () => ref.current
// //     documentTitle: `Bao_cao_thong_ke_${new Date().toLocaleDateString("vi-VN")}`,
// //     onAfterPrint: () => console.log("Đã in báo cáo!"),
// //   });

// //   const handleExportExcel = () => {
// //     if (isLoading || !orders || orders.length === 0) {
// //       alert("Chưa có dữ liệu đơn hàng để xuất!");
// //       return;
// //     }

// //     const dataForExcel = orders.map((order) => ({
// //       "Mã Đơn Hàng": order._id,
// //       "Tên Khách Hàng": order.userId?.fullName || "N/A",
// //       "Số Điện Thoại": order.userId?.phoneNumber || "N/A",
// //       "Địa Chỉ": order.address || "",
// //       "Tổng Tiền": order.totalPrice,
// //       "Trạng thái Giao hàng": order.deliveryStatus,
// //       "Trạng thái Thanh toán": order.paymentStatus,
// //       "Ngày Đặt": new Date(order.createdAt).toLocaleString("vi-VN"),
// //     }));

// //     const ws = XLSX.utils.json_to_sheet(dataForExcel);
// //     ws["!cols"] = [
// //       { wch: 30 },
// //       { wch: 25 },
// //       { wch: 15 },
// //       { wch: 40 },
// //       { wch: 15 },
// //       { wch: 20 },
// //       { wch: 20 },
// //       { wch: 20 },
// //     ];

// //     const wb = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(wb, ws, "DonHang");

// //     const fileName = `Bao_cao_don_hang_chi_tiet_${new Date().toLocaleDateString(
// //       "vi-VN"
// //     )}.xlsx`;
// //     XLSX.writeFile(wb, fileName);
// //   };

// //   return (
// //     <>
// //       {isLoading && <p>Đang tải dữ liệu...</p>}

// //       {!isLoading && (
// //         <div className={classes.dashboard}>
// //           <div className={`${classes.dashboardHeader} no-print`}>
// //             <h4>Bảng Điều Khiển</h4>

// //             <div className={classes.buttonGroup}>
// //               <button
// //                 onClick={handleExportExcel}
// //                 className={classes.excelButton}
// //                 disabled={isLoading}
// //               >
// //                 📊 Xuất Excel (Toàn bộ Đơn hàng)
// //               </button>

// //               <button
// //                 onClick={handlePrint}
// //                 className={classes.printButton}
// //                 disabled={isLoading}
// //               >
// //                 🖨️ In Báo cáo (Tổng quan)
// //               </button>
// //             </div>
// //           </div>

// //           <div ref={reportRef} className={classes.reportWrapper}>
// //             <OrdersBoard statistic={statistic} />
// //             <AdminRevenuePanel year={new Date().getFullYear()} />
// //           </div>

// //           <div className="no-print">
// //             <h5 className={classes.reportSectionTitle}>
// //               Lịch sử Đơn hàng Mới nhất
// //             </h5>
// //             <Orders orders={orders} />
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default Dashboard;

// // ===== FILE: src/pages/admin/Dashboard.jsx (ĐÃ CẬP NHẬT) =====

// import React, { useRef } from "react";
// import { useReactToPrint } from "react-to-print";
// // KHÔNG CẦN "XLSX" VÀ "Orders" nữa
// import classes from "./Dashboard.module.css";
// import OrdersBoard from "./OrdersBoard";
// import AdminRevenuePanel from "../components/AdminRevenuePanel";

// // Prop 'orders' đã được XÓA BỎ. Chỉ cần 'statistic' và 'isLoading'.
// const Dashboard = ({ statistic, isLoading }) => {
//   const reportRef = useRef();

//   // Nút In Báo cáo (Tổng quan) - Giữ nguyên
//   const handlePrint = useReactToPrint({
//     contentRef: reportRef,
//     documentTitle: `Bao_cao_thong_ke_${new Date().toLocaleDateString("vi-VN")}`,
//     onAfterPrint: () => console.log("Đã in báo cáo!"),
//   });

//   // Hàm handleExportExcel đã được DI CHUYỂN sang OrderManagement.jsx

//   return (
//     <>
//       {isLoading && <p>Đang tải dữ liệu...</p>}

//       {!isLoading && (
//         <div className={classes.dashboard}>
//           <div className={`${classes.dashboardHeader} no-print`}>
//             <h4>Bảng Điều Khiển</h4>

//             <div className={classes.buttonGroup}>
//               {/* Nút Xuất Excel đã được chuyển đi */}

//               <button
//                 onClick={handlePrint}
//                 className={classes.printButton}
//                 disabled={isLoading}
//               >
//                 🖨️ In Báo cáo (Tổng quan)
//               </button>
//             </div>
//           </div>

//           {/* Đây là phần báo cáo để in */}
//           <div ref={reportRef} className={classes.reportWrapper}>
//             <OrdersBoard statistic={statistic} />
//             <AdminRevenuePanel year={new Date().getFullYear()} />
//           </div>

//           {/* Phần Lịch sử đơn hàng đã được XÓA BỎ khỏi Dashboard */}
//         </div>
//       )}
//     </>
//   );
// };

// export default Dashboard;

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import classes from "./Dashboard.module.css";
import OrdersBoard from "./OrdersBoard";
import AdminRevenuePanel from "../components/AdminRevenuePanel";

const Dashboard = ({ statistic, isLoading }) => {
  const reportRef = useRef();

  // Lấy ngày hiện tại
  const today = new Date();
  const dateString = `Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Bao_cao_doanh_thu_${today.toLocaleDateString("vi-VN").replace(/\//g, "-")}`,
    onAfterPrint: () => console.log("Đã in báo cáo!"),
  });

  return (
    <>
      {isLoading && <p>Đang tải dữ liệu...</p>}

      {!isLoading && (
        <div className={classes.dashboard}>
          {/* Header Dashboard (Chỉ hiện trên web, ẩn khi in) */}
          <div className={`${classes.dashboardHeader} no-print`}>
            <h4>Bảng Điều Khiển</h4>
            <div className={classes.buttonGroup}>
              <button
                onClick={handlePrint}
                className={classes.printButton}
                disabled={isLoading}
              >
                🖨️ In Báo cáo (Tổng quan)
              </button>
            </div>
          </div>

          {/* ===== PHẦN NỘI DUNG SẼ ĐƯỢC IN ===== */}
          <div ref={reportRef} className={classes.reportWrapper}>
            
            {/* 1. HEADER BÁO CÁO (Tên cửa hàng + LOGO) */}
            <div className={classes.printHeader}>
              
              {/* 👇 LOGO CỦA BẠN 👇 */}
              <img 
                src="/images/LOGO.png" 
                alt="Boutique Logo" 
                className={classes.printLogo} 
              />
              
              <h2 className={classes.storeName}>BOUTIQUE</h2>
              <p className={classes.storeAddress}>Địa chỉ: 236B Lê Văn Sỹ, Trường Đại Học Tài Nguyên và Môi Trường TP.HCM</p>
              
              <hr className={classes.divider} />
              
              <h3 className={classes.reportTitle}>BÁO CÁO DOANH THU & HIỆU QUẢ KINH DOANH</h3>
              <p className={classes.reportDate}>({dateString})</p>
            </div>

            {/* 2. NỘI DUNG CHÍNH (Biểu đồ & Số liệu) */}
            <div className={classes.reportContent}>
               <OrdersBoard statistic={statistic} />
               <div style={{ height: "20px" }}></div>
               <AdminRevenuePanel year={new Date().getFullYear()} />
            </div>

            {/* 3. FOOTER BÁO CÁO (Chữ ký) */}
            <div className={classes.printFooter}>
              <div className={classes.signatureSection}>
                <p className={classes.signatureDate}>TP.HCM, {dateString}</p>
                <p className={classes.signatureTitle}><strong>Người lập báo cáo</strong></p>
                <p className={classes.signatureNote}>(Ký và ghi rõ họ tên)</p>
                
                {/* Khoảng trống để ký */}
                <div className={classes.signatureSpace}></div>
                
                <p className={classes.signatureName}>Admin Boutique</p>
              </div>
            </div>

          </div>
          {/* ==================================== */}

        </div>
      )}
    </>
  );
};

export default Dashboard;