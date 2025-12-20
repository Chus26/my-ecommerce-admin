// 

import React, { useEffect, useMemo, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import classes from "./CategoryStats.module.css";
import { FaFileExcel, FaChartPie, FaChevronRight, FaChevronDown } from "react-icons/fa";

// Import the service that fetches admin orders with the year parameter
import { axiosGetOrdersAdminDashBoard } from "../services/orderServices";
import { getAuthToken } from "../utils/auth";

const CategoryStats = () => {
  // Local state for orders specific to this report
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [expanded, setExpanded] = useState({});

  // --- FETCH DATA EFFECT ---
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Call the same API as the Dashboard, passing the selected year.
        // The backend will filter orders for this year (startDate to endDate).
        const data = await axiosGetOrdersAdminDashBoard(token, year);
        
        if (data && data.orders) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error loading report data:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [year]); // Re-run whenever the year changes

  // --- CLASSIFICATION LOGIC ---
  const getHierarchy = (productName, category) => {
    const cat = (category || "").toLowerCase().trim();
    const name = (productName || "").toLowerCase().trim();

    // 1. MAIN PRODUCTS (Devices)
    if (cat === "iphone") return { superCat: "Sản phẩm chính", subCat: "iPhone" };
    if (cat === "ipad") return { superCat: "Sản phẩm chính", subCat: "iPad" };
    if (cat === "macbook") return { superCat: "Sản phẩm chính", subCat: "MacBook" };
    if (cat === "watch") return { superCat: "Sản phẩm chính", subCat: "Apple Watch" };

    // 2. ACCESSORIES
    if (cat === "case") return { superCat: "Phụ kiện", subCat: "Ốp lưng" };
    if (cat === "charger") return { superCat: "Phụ kiện", subCat: "Củ sạc & Bộ sạc" };
    if (cat === "cable") return { superCat: "Phụ kiện", subCat: "Cáp kết nối" };
    if (cat === "applepencil") return { superCat: "Phụ kiện", subCat: "Apple Pencil" };
    if (cat === "airpod") return { superCat: "Phụ kiện", subCat: "AirPods" };

    // 3. Fallback based on name
    if (name.includes("ốp") || name.includes("case")) return { superCat: "Phụ kiện", subCat: "Ốp lưng" };
    if (name.includes("sạc") || name.includes("adapter")) return { superCat: "Phụ kiện", subCat: "Củ sạc & Bộ sạc" };
    if (name.includes("cáp") || name.includes("cable")) return { superCat: "Phụ kiện", subCat: "Cáp kết nối" };

    return null;
  };

  // --- DATA PROCESSING ---
  const statistics = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    const tree = {};
    let totalRevenueAll = 0;

    orders.forEach((order) => {
      // The backend has already filtered by year, but we double-check the status
      // to ensure we only count successful revenue.
      const isSuccess = 
        order.paymentStatus === "Paid" && 
        order.deliveryStatus === "Delivered";

      if (isSuccess) {
        order.items.forEach((item) => {
          const productCategory = item.product.category || ""; 
          const hierarchy = getHierarchy(item.product.name, productCategory);
          
          // Skip if product doesn't fit hierarchy
          if (!hierarchy) return;

          const { superCat, subCat } = hierarchy;
          const revenue = item.quantity * item.product.price;
          const pName = item.product.name;

          // Initialize Super Category level
          if (!tree[superCat]) {
            tree[superCat] = { name: superCat, revenue: 0, quantity: 0, subs: {} };
          }
          tree[superCat].revenue += revenue;
          tree[superCat].quantity += item.quantity;

          // Initialize Sub Category level
          if (!tree[superCat].subs[subCat]) {
            tree[superCat].subs[subCat] = { name: subCat, revenue: 0, quantity: 0, products: {} };
          }
          tree[superCat].subs[subCat].revenue += revenue;
          tree[superCat].subs[subCat].quantity += item.quantity;

          // Initialize Product level
          if (!tree[superCat].subs[subCat].products[pName]) {
            tree[superCat].subs[subCat].products[pName] = { name: pName, revenue: 0, quantity: 0 };
          }
          tree[superCat].subs[subCat].products[pName].revenue += revenue;
          tree[superCat].subs[subCat].products[pName].quantity += item.quantity;
          
          totalRevenueAll += revenue;
        });
      }
    });

    // Sort and calculate percentages
    const sortedSuper = Object.values(tree).sort((a, b) => b.revenue - a.revenue);
    sortedSuper.forEach(sup => {
        sup.percent = totalRevenueAll ? (sup.revenue / totalRevenueAll * 100) : 0;
        sup.subList = Object.values(sup.subs).sort((a, b) => b.revenue - a.revenue);
        sup.subList.forEach(sub => {
            sub.productList = Object.values(sub.products).sort((a, b) => b.revenue - a.revenue);
        });
    });
    return sortedSuper;
  }, [orders]); // Only re-calculate when 'orders' changes (which updates when 'year' changes)

  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  // --- EXCEL EXPORT FUNCTION ---
  const handleExportExcel = async () => {
    if(!statistics.length) return alert("Không có dữ liệu để xuất!");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('BaoCaoDoanhThu');

    worksheet.columns = [
      { key: 'stt', width: 8 },
      { key: 'name', width: 50 },
      { key: 'unit', width: 15 },
      { key: 'quantity', width: 15 },
      { key: 'revenue', width: 25 },
      { key: 'percent', width: 15 },
    ];

    worksheet.mergeCells('A1:F1');
    const companyRow = worksheet.getCell('A1');
    companyRow.value = "BOUTIQUE SHOP - 236B Lê Văn Sỹ, TP.HCM";
    companyRow.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF666666' } };
    companyRow.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A3:F3');
    const titleRow = worksheet.getCell('A3');
    titleRow.value = `BÁO CÁO DOANH THU THEO LOẠI HÀNG NĂM ${year}`;
    titleRow.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FF000000' } }; 
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A4:F4');
    const subTitleRow = worksheet.getCell('A4');
    subTitleRow.value = "(Dữ liệu tính trên đơn hàng đã thanh toán & giao thành công)";
    subTitleRow.font = { name: 'Arial', size: 10, italic: true };
    subTitleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A5:F5');
    const dateRow = worksheet.getCell('A5');
    dateRow.value = `Ngày lập báo cáo: ${new Date().toLocaleDateString('vi-VN')}`;
    dateRow.font = { name: 'Arial', size: 10 };
    dateRow.alignment = { vertical: 'middle', horizontal: 'center' };

    const headerRow = worksheet.addRow(['STT', 'Tên Hàng Hóa / Nhóm Hàng', 'Đơn vị tính', 'Số lượng', 'Doanh thu (VNĐ)', 'Tỷ trọng']);
    headerRow.eachCell((cell) => {
      cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } }; 
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2196F3' } 
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    let stt = 1;
    statistics.forEach((sup) => {
      const rowL1 = worksheet.addRow([
        stt++, 
        sup.name.toUpperCase(), 
        "Nhóm", 
        sup.quantity, 
        sup.revenue, 
        sup.percent/100
      ]);
      rowL1.font = { name: 'Arial', size: 11, bold: true };
      rowL1.getCell('revenue').numFmt = '#,##0 "₫"';
      rowL1.getCell('percent').numFmt = '0.00%';
      rowL1.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE3F2FD' } }; 
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      sup.subList.forEach((sub) => {
        const rowL2 = worksheet.addRow([
          "", 
          `   • ${sub.name}`, 
          "Dòng", 
          sub.quantity, 
          sub.revenue, 
          ""
        ]);
        rowL2.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF444444' } };
        rowL2.getCell('revenue').numFmt = '#,##0 "₫"';
        rowL2.eachCell(cell => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });

        sub.productList.forEach((prod) => {
          const rowL3 = worksheet.addRow([
            "", 
            `         - ${prod.name}`, 
            "Cái", 
            prod.quantity, 
            prod.revenue, 
            ""
          ]);
          rowL3.font = { name: 'Arial', size: 10 };
          rowL3.getCell('revenue').numFmt = '#,##0 "₫"';
          rowL3.eachCell(cell => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          });
        });
      });
    });

    const totalRevenue = statistics.reduce((acc, cur) => acc + cur.revenue, 0);
    const totalQuantity = statistics.reduce((acc, cur) => acc + cur.quantity, 0);
    
    const totalRow = worksheet.addRow(["", "TỔNG CỘNG", "", totalQuantity, totalRevenue, 1]);
    totalRow.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFF0000' } }; 
    totalRow.getCell('revenue').numFmt = '#,##0 "₫"';
    totalRow.getCell('percent').numFmt = '0.00%';
    totalRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }; 
        cell.border = { top: { style: 'medium' }, left: { style: 'thin' }, bottom: { style: 'medium' }, right: { style: 'thin' } };
        cell.alignment = { vertical: 'middle' };
    });

    worksheet.addRow([]);
    worksheet.addRow([]);

    const footerRow1 = worksheet.addRow(["", "Người lập biểu", "", "", "Kế toán trưởng", "", "Giám đốc"]);
    const footerRow2 = worksheet.addRow(["", "(Ký, họ tên)", "", "", "(Ký, họ tên)", "", "(Ký, họ tên, đóng dấu)"]);
    
    footerRow1.getCell(2).font = { bold: true }; 
    footerRow1.getCell(5).font = { bold: true }; 
    footerRow1.getCell(7).font = { bold: true }; 
    
    footerRow1.alignment = { horizontal: 'center' };
    footerRow2.alignment = { horizontal: 'center' };
    footerRow2.font = { italic: true, size: 10 };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `BaoCao_DoanhThu_${year}.xlsx`);
  };

  if (loading) return <p className={classes.loading}>Đang tải dữ liệu...</p>;

  return (
    <div className={classes.statsContainer}>
      <div className={classes.header}>
        <div className={classes.titleGroup}>
          <FaChartPie className={classes.iconTitle} />
          <div>
            <h2>Báo cáo doanh thu từng năm </h2>
            <span className={classes.subTitle}>Dữ liệu kinh doanh năm {year}</span>
          </div>
        </div>

        <div className={classes.actions}>
          <div className={classes.filter}>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
              <option value="2023">Năm 2023</option>
              <option value="2024">Năm 2024</option>
              <option value="2025">Năm 2025</option>
              <option value="2026">Năm 2026</option>
            </select>
          </div>
          <button onClick={handleExportExcel} className={classes.exportBtn}>
            <FaFileExcel /> Xuất Excel
          </button>
        </div>
      </div>

      <div className={classes.tableWrapper}>
        <table className={classes.table}>
          <thead>
            <tr>
              <th style={{width: "50px"}}></th>
              <th>Phân loại / Sản phẩm</th>
              <th className={classes.textRight}>Số lượng</th>
              <th className={classes.textRight}>Doanh thu</th>
              <th>Tỷ trọng</th>
            </tr>
          </thead>
          <tbody>
            {statistics.length > 0 ? statistics.map((sup) => (
              <React.Fragment key={sup.name}>
                <tr className={classes.rowLevel1} onClick={() => toggle(sup.name)}>
                  <td className={classes.iconCell}>
                    {expanded[sup.name] ? <FaChevronDown size={12}/> : <FaChevronRight size={12}/>}
                  </td>
                  <td className={classes.nameL1}>{sup.name.toUpperCase()}</td>
                  <td className={classes.textRight}>{sup.quantity}</td>
                  <td className={`${classes.moneyL1} ${classes.textRight}`}>{sup.revenue.toLocaleString("vi-VN")} ₫</td>
                  <td>
                    <div className={classes.percentBar}>
                      <div className={classes.fill} style={{ width: `${sup.percent}%` }}></div>
                      <span className={classes.percentLabel}>{sup.percent.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>

                {expanded[sup.name] && sup.subList.map(sub => {
                    const subKey = `${sup.name}-${sub.name}`;
                    return (
                        <React.Fragment key={subKey}>
                            <tr className={classes.rowLevel2} onClick={() => toggle(subKey)}>
                                <td className={classes.iconCell}></td>
                                <td className={classes.nameL2}>
                                    {expanded[subKey] ? <FaChevronDown size={10}/> : <FaChevronRight size={10}/>} 
                                    <span style={{marginLeft: "8px"}}>{sub.name}</span>
                                </td>
                                <td className={classes.textRight}>{sub.quantity}</td>
                                <td className={classes.textRight}>{sub.revenue.toLocaleString("vi-VN")} ₫</td>
                                <td></td>
                            </tr>

                            {expanded[subKey] && sub.productList.map(prod => (
                                <tr key={prod.name} className={classes.rowLevel3}>
                                    <td></td>
                                    <td className={classes.nameL3}>{prod.name}</td>
                                    <td className={classes.textRight}>{prod.quantity}</td>
                                    <td className={classes.textRight}>{prod.revenue.toLocaleString("vi-VN")} ₫</td>
                                    <td></td>
                                </tr>
                            ))}
                        </React.Fragment>
                    );
                })}
              </React.Fragment>
            )) : (
              <tr>
                <td colSpan="5" className={classes.loading}>
                  Chưa có đơn hàng thành công (Paid & Delivered) trong năm {year}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryStats;