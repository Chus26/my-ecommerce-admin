
// export default Dashboard;

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import classes from "./Dashboard.module.css";
import OrdersBoard from "./OrdersBoard";
import AdminRevenuePanel from "../components/AdminRevenuePanel";

// ✅ Nhận props: selectedYear, onChangeYear từ InfoBoard
const Dashboard = ({ statistic, isLoading, selectedYear, onChangeYear }) => {
  const reportRef = useRef();

  // Lấy ngày hiện tại cho báo cáo
  const today = new Date();
  const dateString = `Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  // Hàm xử lý in
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Bao_cao_doanh_thu_${selectedYear}_${today.toLocaleDateString("vi-VN").replace(/\//g, "-")}`,
    onAfterPrint: () => console.log("Đã in báo cáo!"),
  });

  return (
    <>
      {isLoading && <p>Đang tải dữ liệu...</p>}

      {!isLoading && (
        <div className={classes.dashboard}>
          {/* Header Dashboard (Chỉ hiện trên web, ẩn khi in) */}
          <div className={`${classes.dashboardHeader} no-print`}>
            {/* <h4>Bảng Điều Khiển</h4>  <-- Tiêu đề tùy chọn */}
            
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
            
            {/* 1. HEADER BÁO CÁO (Chỉ hiện khi in hoặc preview in) */}
            <div className={classes.printHeader}>
              <img 
                src="/images/LOGO.png" 
                alt="Boutique Logo" 
                className={classes.printLogo} 
              />
              <h2 className={classes.storeName}>BOUTIQUE</h2>
              <p className={classes.storeAddress}>Địa chỉ: 236B Lê Văn Sỹ, Trường Đại Học Tài Nguyên và Môi Trường TP.HCM</p>
              <hr className={classes.divider} />
              
              {/* ✅ HIỂN THỊ NĂM ĐANG CHỌN TRONG TIÊU ĐỀ BÁO CÁO */}
              <h3 className={classes.reportTitle}>BÁO CÁO HIỆU QUẢ KINH DOANH NĂM {selectedYear}</h3>
              
              <p className={classes.reportDate}>({dateString})</p>
            </div>

            {/* 2. NỘI DUNG CHÍNH */}
            <div className={classes.reportContent}>
               {/* Các ô số liệu to (Card) - Dữ liệu đã được lọc theo năm ở InfoBoard */}
               <OrdersBoard statistic={statistic} />
               
               <div style={{ height: "20px" }}></div>
               
               {/* 👇 QUAN TRỌNG: Truyền selectedYear xuống đây để biểu đồ vẽ lại theo năm */}
               <AdminRevenuePanel 
                  year={selectedYear} 
                  setYear={onChangeYear} 
               />
            </div>

            {/* 3. FOOTER BÁO CÁO */}
            <div className={classes.printFooter}>
              <div className={classes.signatureSection}>
                <p className={classes.signatureDate}>TP.HCM, {dateString}</p>
                <p className={classes.signatureTitle}><strong>Người lập báo cáo</strong></p>
                <p className={classes.signatureNote}>(Ký và ghi rõ họ tên)</p>
                <div className={classes.signatureSpace}></div>
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