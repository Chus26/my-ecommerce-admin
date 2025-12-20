// // ===== FILE: src/components/Products.jsx (HOÀN CHỈNH - ADMIN PRODUCT) =====

// import React, { useState, useMemo, useEffect } from "react";
// // ✅ 1. IMPORT THƯ VIỆN XLSX
// import * as XLSX from "xlsx";
// //Import css module
// import classes from "./Products.module.css";

// //React-router-dom
// import { useSearchParams } from "react-router-dom";

// //Dịch vụ Sản phẩm & Auth
// import { axiosDeleteProductAdmin } from "../services/productServices";
// import { getAuthToken } from "../utils/auth";


// // ===============================================
// // Component Pagination (Lô gic phân trang)
// // ===============================================
// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//   const handlePrev = () => {
//     if (currentPage > 1) {
//       onPageChange(currentPage - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       onPageChange(currentPage + 1);
//     }
//   };

//   const handlePageClick = (page) => {
//     onPageChange(page);
//   };

//   // Logic để tạo ra các số trang (vd: 1 ... 4 5 6 ... 10)
//   const getPageNumbers = () => {
//     const pages = [];
//     const maxPagesToShow = 5; 
//     const half = Math.floor(maxPagesToShow / 2);

//     let start = Math.max(1, currentPage - half);
//     let end = Math.min(totalPages, currentPage + half);

//     if (currentPage - half < 1) {
//       end = Math.min(totalPages, maxPagesToShow);
//     }

//     if (currentPage + half > totalPages) {
//       start = Math.max(1, totalPages - maxPagesToShow + 1);
//     }
    
//     // Luôn thêm trang 1
//     if (start > 1) {
//       pages.push(1);
//       if (start > 2) {
//         pages.push("..."); 
//       }
//     }

//     // Các trang ở giữa
//     for (let i = start; i <= end; i++) {
//       pages.push(i);
//     }

//     // Luôn thêm trang cuối
//     if (end < totalPages) {
//       if (end < totalPages - 1) {
//         pages.push("...");
//       }
//       pages.push(totalPages);
//     }

//     return pages;
//   };

//   const pageNumbers = getPageNumbers();

//   return (
//     <div className={classes.pagination}>
//       <button onClick={handlePrev} disabled={currentPage === 1}>
//         « Trước
//       </button>
//       {pageNumbers.map((page, index) =>
//         typeof page === "number" ? (
//           <button
//             key={page}
//             onClick={() => handlePageClick(page)}
//             className={page === currentPage ? classes.activePage : ""}
//           >
//             {page}
//           </button>
//         ) : (
//           <span key={`dots-${index}`} className={classes.dots}>
//             ...
//           </span>
//         )
//       )}
//       <button onClick={handleNext} disabled={currentPage === totalPages}>
//         Sau »
//       </button>
//     </div>
//   );
// };


// // ===============================================
// // Component Table (Bảng hiển thị sản phẩm)
// // ===============================================
// const Table = ({ products, setProducts }) => {
//   const token = getAuthToken();
//   const [, setLocation] = useSearchParams();

//   const formatDateTime = (value) => {
//     if (!value) return "—";
//     return new Date(value).toLocaleString("vi-VN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const truncate = (str = "", n = 100) =>
//     (str || "").length > n ? `${str.slice(0, n)}…` : str;

//   const handleDelete = async (productId) => {
//     if (window.confirm("Bạn có chắc muốn xoá sản phẩm này không?")) {
//       try {
//         const data = await axiosDeleteProductAdmin(token, productId);
//         if (data?.message) {
//           // Gọi setProducts để cập nhật state gốc ở component cha
//           setProducts((prev) => prev.filter((p) => p._id !== productId));
//           alert(data.message);
//         } else {
//           alert("Xoá thất bại!");
//         }
//       } catch (error) {
//         alert(
//           "Có lỗi xảy ra khi xoá: " +
//             (error.response?.data?.message || error.message)
//         );
//       }
//     }
//   };

//   return (
//     <div className={classes.products}>
//       <table>
//         <thead>
//           <tr>
//             <th scope="col">Mã hàng</th>
//             <th scope="col">Tên</th>
//             <th scope="col">Mô tả</th>
//             <th scope="col">Giá bán</th>
//             <th scope="col">Ngày cập nhật</th>
//             <th scope="col">Hình ảnh</th>
//             <th scope="col">Danh mục</th>
//             <th scope="col">Tồn kho</th>
//             <th scope="col">Chỉnh sửa</th>
//           </tr>
//         </thead>

//         {products.map((product, index) => {
//           const shortDesc =
//             product.short_desc || product.shortDescription || "";

//           return (
//             <tbody key={product._id}>
//               <tr className={index % 2 === 0 ? `${classes.gray}` : ""}>
//                 <td>{product.code || "—"}</td>
//                 <td>{product.name}</td>
//                 <td className={classes.shortCell} title={shortDesc}>
//                   {truncate(shortDesc, 100)}
//                 </td>
//                 <td>
//                   {new Intl.NumberFormat("vi-VN", {
//                     style: "currency",
//                     currency: "VND",
//                   }).format(Number(product.price) || 0)}
//                 </td>
//                 <td className={classes.dateCell}>
//                   {formatDateTime(product.updatedAt || product.createdAt)}
//                 </td>
//                 <td>
//                   {product.img1 && <img src={product.img1} alt={product.name} />}
//                 </td>
//                 <td>{product.category}</td>
//                 <td className={classes.stockCell}>
//                   {Number(product.stock) || 0}
//                 </td>
//                 <td>
//                   <div className={classes.action}>
//                     <button
//                       onClick={() =>
//                         setLocation({ location: `edit-product_${product._id}` })
//                       }
//                       className={classes.update}
//                     >
//                       Cập nhật
//                     </button>
//                     <button onClick={() => handleDelete(product._id)}>
//                       Xoá
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             </tbody>
//           );
//         })}
//       </table>
//     </div>
//   );
// };


// // ===============================================
// // Component Products chính (CẬP NHẬT)
// // ===============================================
// const ITEMS_PER_PAGE = 10; // Đặt số lượng sản phẩm mỗi trang

// const Products = ({ isLoading, products = [], setProducts }) => {
//   const [, setLocation] = useSearchParams();
//   const [searchValue, setSearchValue] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1); // State cho trang hiện tại

//   // Lấy danh sách danh mục duy nhất (Giữ nguyên)
//   const uniqueCategories = useMemo(() => {
//     const categories = new Set(products.map((p) => p.category).filter(Boolean));
//     return ["all", ...Array.from(categories)];
//   }, [products]);

//   // Lọc sản phẩm (Giữ nguyên logic lọc)
//   const filteredProducts = useMemo(() => {
//     const lowerCaseSearch = searchValue.toLowerCase().trim();

//     return products.filter((product) => {
//       // 1. Lọc theo danh mục
//       const categoryMatch =
//         selectedCategory === "all" ||
//         product.category?.toLowerCase() === selectedCategory.toLowerCase();
//       if (!categoryMatch) {
//         return false;
//       }

//       // 2. Lọc theo searchValue (Tên, Mã hàng)
//       if (!lowerCaseSearch) {
//         return true;
//       }
//       const productName = product.name?.toString().toLowerCase() || "";
//       const productCode = product.code?.toString().toLowerCase() || "";

//       return (
//         productName.includes(lowerCaseSearch) ||
//         productCode.includes(lowerCaseSearch)
//       );
//     });
//   }, [products, searchValue, selectedCategory]);

//   // TÍNH TOÁN PHÂN TRANG
//   const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

//   // Cắt (slice) danh sách sản phẩm để chỉ hiển thị cho trang hiện tại
//   const paginatedProducts = useMemo(() => {
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     const endIndex = startIndex + ITEMS_PER_PAGE;
//     return filteredProducts.slice(startIndex, endIndex);
//   }, [filteredProducts, currentPage]);


//   // QUAN TRỌNG: Reset về trang 1 khi người dùng lọc hoặc tìm kiếm
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchValue, selectedCategory]);


//   // ✅ 2. HÀM XUẤT EXCEL CHO SẢN PHẨM (MỚI THÊM)
//   const handleExportExcel = () => {
//     if (isLoading || !filteredProducts || filteredProducts.length === 0) {
//       alert("Chưa có dữ liệu sản phẩm để xuất!");
//       return;
//     }

//     // Chuẩn bị dữ liệu cho Excel
//     const dataForExcel = filteredProducts.map((product) => ({
//       "Mã Hàng": product.code || "",
//       "Tên Sản Phẩm": product.name || "",
//       "Danh Mục": product.category || "",
//       "Giá Bán (VND)": product.price || 0,
//       "Tồn Kho": product.stock || 0,
//       "Phụ Kiện?": product.isAccessory ? "Có" : "Không",
//       // Ghép mảng tags thành chuỗi "tag1, tag2"
//       "Tags AI": product.compatibilityTags?.join(', ') || "",
//       "Ngày Cập Nhật": new Date(product.updatedAt).toLocaleDateString("vi-VN"),
//     }));

//     // Tạo Sheet
//     const ws = XLSX.utils.json_to_sheet(dataForExcel);
    
//     // Định dạng độ rộng cột
//     ws["!cols"] = [
//       { wch: 15 }, // Mã hàng
//       { wch: 40 }, // Tên
//       { wch: 15 }, // Danh mục
//       { wch: 15 }, // Giá bán
//       { wch: 10 }, // Tồn kho
//       { wch: 10 }, // Phụ kiện?
//       { wch: 45 }, // Tags AI
//       { wch: 20 }  // Ngày cập nhật
//     ];

//     // Tạo Workbook và Xuất file
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "DanhSachSanPham");
    
//     const fileName = `Bao_cao_san_pham_${new Date().toLocaleDateString("vi-VN")}.xlsx`;
//     XLSX.writeFile(wb, fileName);
//   };


//   const searchValueChangeHandler = (e) => {
//     setSearchValue(e.target.value);
//   };

//   const categoryChangeHandler = (e) => {
//     setSelectedCategory(e.target.value);
//   };

//   return (
//     <React.Fragment>
//       {isLoading && <p>Đang tải dữ liệu ...</p>}
//       {!isLoading && (
//         <div className={classes.index}>
//           <div className={classes.head}>
//             <h3>Sản phẩm</h3>
//             {/* ✅ 3. THÊM NÚT EXCEL VÀO HEADER */}
//             <div className={classes.buttonGroup}>
//                 <button 
//                     onClick={handleExportExcel} 
//                     className={classes.excelButton}
//                     disabled={isLoading || filteredProducts.length === 0}
//                     style={{ marginRight: '10px', backgroundColor: '#28a745' }} // Style nhanh
//                 >
//                     📊 Xuất Excel ({filteredProducts.length} SP)
//                 </button>
//                 <button onClick={() => setLocation({ location: "new-product" })}>
//                     Thêm sản phẩm
//                 </button>
//             </div>
//           </div>

//           {/* Khu vực Bộ lọc (Giữ nguyên) */}
//           <div className={classes.filters}>
//             <input
//               type="text"
//               placeholder="Tìm theo Tên, Mã hàng..."
//               value={searchValue}
//               onChange={searchValueChangeHandler}
//             />
//             <select
//               value={selectedCategory}
//               onChange={categoryChangeHandler}
//               className={classes.categorySelect}
//             >
//               {uniqueCategories.map((category) => (
//                 <option key={category} value={category}>
//                   {category === "all" ? "Tất cả danh mục" : category}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Hiển thị bảng hoặc thông báo */}
//           {paginatedProducts && paginatedProducts.length > 0 ? (
//             <>
//               <Table
//                 products={paginatedProducts} // <-- Chỉ truyền sản phẩm của trang này
//                 setProducts={setProducts} 
//               />
//               {/* === THÊM KHU VỰC PHÂN TRANG === */}
//               <div className={classes.paginationContainer}>
//                  <p className={classes.totalCount}>
//                   Hiển thị {paginatedProducts.length} trên tổng số {filteredProducts.length} sản phẩm
//                  </p>
//                 {totalPages > 1 && (
//                   <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     onPageChange={setCurrentPage} // Truyền hàm setCurrentPage
//                   />
//                 )}
//               </div>
//             </>
//           ) : (
//             <p>Không tìm thấy sản phẩm nào phù hợp.</p>
//           )}
//         </div>
//       )}
//     </React.Fragment>
//   );
// };

// export default Products;

import React, { useState, useMemo, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import classes from "./Products.module.css";
import { useSearchParams } from "react-router-dom";
import { axiosDeleteProductAdmin } from "../services/productServices";
import { getAuthToken } from "../utils/auth";

// ===============================================
// Component Pagination (Giữ nguyên)
// ===============================================
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => { if (currentPage > 1) onPageChange(currentPage - 1); };
  const handleNext = () => { if (currentPage < totalPages) onPageChange(currentPage + 1); };
  const handlePageClick = (page) => { onPageChange(page); };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; 
    const half = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);
    if (currentPage - half < 1) end = Math.min(totalPages, maxPagesToShow);
    if (currentPage + half > totalPages) start = Math.max(1, totalPages - maxPagesToShow + 1);
    
    if (start > 1) { pages.push(1); if (start > 2) pages.push("..."); }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) { if (end < totalPages - 1) pages.push("..."); pages.push(totalPages); }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={classes.pagination}>
      <button onClick={handlePrev} disabled={currentPage === 1}>« Trước</button>
      {pageNumbers.map((page, index) =>
        typeof page === "number" ? (
          <button key={page} onClick={() => handlePageClick(page)} className={page === currentPage ? classes.activePage : ""}>{page}</button>
        ) : ( <span key={`dots-${index}`} className={classes.dots}>...</span> )
      )}
      <button onClick={handleNext} disabled={currentPage === totalPages}>Sau »</button>
    </div>
  );
};

// ===============================================
// Component Table (Giữ nguyên logic hiển thị)
// ===============================================
const Table = ({ products, setProducts }) => {
  const token = getAuthToken();
  const [, setLocation] = useSearchParams();

  const formatDateTime = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const truncate = (str = "", n = 100) => (str || "").length > n ? `${str.slice(0, n)}…` : str;

  const handleDelete = async (productId) => {
    if (window.confirm("Bạn có chắc muốn xoá sản phẩm này không?")) {
      try {
        const data = await axiosDeleteProductAdmin(token, productId);
        if (data?.message) {
          setProducts((prev) => prev.filter((p) => p._id !== productId));
          alert(data.message);
        } else {
          alert("Xoá thất bại!");
        }
      } catch (error) {
        alert("Có lỗi xảy ra khi xoá: " + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className={classes.products}>
      <table>
        <thead>
          <tr>
            <th scope="col">Mã hàng</th>
            <th scope="col">Tên</th>
            <th scope="col">Mô tả</th>
            <th scope="col">Giá bán</th>
            <th scope="col">Ngày cập nhật</th>
            <th scope="col">Hình ảnh</th>
            <th scope="col">Danh mục</th>
            <th scope="col">Tồn kho</th>
            <th scope="col">Chỉnh sửa</th>
          </tr>
        </thead>
        {products.map((product, index) => {
          const shortDesc = product.short_desc || product.shortDescription || "";
          return (
            <tbody key={product._id}>
              <tr className={index % 2 === 0 ? `${classes.gray}` : ""}>
                <td>{product.code || "—"}</td>
                <td>{product.name}</td>
                <td className={classes.shortCell} title={shortDesc}>{truncate(shortDesc, 100)}</td>
                <td>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(product.price) || 0)}</td>
                <td className={classes.dateCell}>{formatDateTime(product.updatedAt || product.createdAt)}</td>
                <td>{product.img1 && <img src={product.img1} alt={product.name} />}</td>
                <td>{product.category}</td>
                <td className={classes.stockCell}>{Number(product.stock) || 0}</td>
                <td>
                  <div className={classes.action}>
                    <button onClick={() => setLocation({ location: `edit-product_${product._id}` })} className={classes.update}>Cập nhật</button>
                    <button onClick={() => handleDelete(product._id)}>Xoá</button>
                  </div>
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
};

// ===============================================
// Component Products Chính
// ===============================================
const ITEMS_PER_PAGE = 10;

const Products = ({ isLoading, products = [], setProducts }) => {
  const [, setLocation] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(products.map((p) => p.category).filter(Boolean));
    return ["all", ...Array.from(categories)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const lowerCaseSearch = searchValue.toLowerCase().trim();
    return products.filter((product) => {
      const categoryMatch = selectedCategory === "all" || product.category?.toLowerCase() === selectedCategory.toLowerCase();
      if (!categoryMatch) return false;
      if (!lowerCaseSearch) return true;
      const productName = product.name?.toString().toLowerCase() || "";
      const productCode = product.code?.toString().toLowerCase() || "";
      return productName.includes(lowerCaseSearch) || productCode.includes(lowerCaseSearch);
    });
  }, [products, searchValue, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchValue, selectedCategory]);

  // --- LOGIC PHÂN LOẠI ---
  const getHierarchy = (productName, category) => {
    const cat = (category || "").toLowerCase().trim();
    const name = (productName || "").toLowerCase().trim();

    // 1. NHÓM SẢN PHẨM CHÍNH
    if (cat === "iphone") return { superCat: "SẢN PHẨM CHÍNH", subCat: "iPhone" };
    if (cat === "ipad") return { superCat: "SẢN PHẨM CHÍNH", subCat: "iPad" };
    if (cat === "macbook") return { superCat: "SẢN PHẨM CHÍNH", subCat: "MacBook" };
    if (cat === "watch") return { superCat: "SẢN PHẨM CHÍNH", subCat: "Apple Watch" };
    

    // 2. NHÓM PHỤ KIỆN
    if (cat === "case") return { superCat: "PHỤ KIỆN", subCat: "Ốp lưng" };
    if (cat === "charger") return { superCat: "PHỤ KIỆN", subCat: "Củ sạc & Bộ sạc" };
    if (cat === "cable") return { superCat: "PHỤ KIỆN", subCat: "Cáp kết nối" };
    if (cat === "applepencil") return { superCat: "PHỤ KIỆN", subCat: "Apple Pencil" };
    if (cat === "airpod") return { superCat: "PHỤ KIỆN", subCat: "AirPods" };
    
    // Fallback theo tên
    if (name.includes("ốp") || name.includes("case")) return { superCat: "PHỤ KIỆN", subCat: "Ốp lưng & Bao da" };
    if (name.includes("sạc") || name.includes("adapter")) return { superCat: "PHỤ KIỆN", subCat: "Củ sạc & Bộ sạc" };
    if (name.includes("cáp") || name.includes("cable")) return { superCat: "PHỤ KIỆN", subCat: "Cáp kết nối" };
    
    // 3. KHÁC
    return { superCat: "PHỤ KIỆN", subCat: "Phụ kiện khác" };
  };

  // --- HÀM XUẤT EXCEL CAO CẤP ---
  const handleExportExcel = async () => {
    if (isLoading || !filteredProducts || filteredProducts.length === 0) {
      alert("Chưa có dữ liệu sản phẩm để xuất!");
      return;
    }

    // 1. Xử lý dữ liệu thành dạng cây (Tree)
    const tree = {};
    let totalStock = 0;
    let totalValue = 0; // ✅ SỬ DỤNG BIẾN NÀY ĐỂ FIX WARNING

    filteredProducts.forEach((p) => {
      const { superCat, subCat } = getHierarchy(p.name, p.category);
      
      if (!tree[superCat]) tree[superCat] = { name: superCat, count: 0, subs: {} };
      tree[superCat].count++;

      if (!tree[superCat].subs[subCat]) tree[superCat].subs[subCat] = { name: subCat, count: 0, products: [] };
      tree[superCat].subs[subCat].count++;
      
      tree[superCat].subs[subCat].products.push(p);
      
      const stock = Number(p.stock) || 0;
      const price = Number(p.price) || 0;
      
      totalStock += stock;
      totalValue += price * stock; // Cộng dồn giá trị tồn kho
    });

    // 2. Khởi tạo ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('DanhSachSanPham');

    // 3. Định nghĩa cột
    worksheet.columns = [
      { key: 'stt', width: 8 },
      { key: 'code', width: 15 },
      { key: 'name', width: 50 }, 
      { key: 'price', width: 20 },
      { key: 'stock', width: 15 },
      { key: 'category', width: 20 },
      { key: 'updated', width: 15 },
    ];

    // 4. Header Báo Cáo
    worksheet.mergeCells('A1:G1');
    const companyRow = worksheet.getCell('A1');
    companyRow.value = "BOUTIQUE SHOP - 236B Lê Văn Sỹ";
    companyRow.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF666666' } };
    companyRow.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A3:G3');
    const titleRow = worksheet.getCell('A3');
    titleRow.value = `BÁO CÁO DANH SÁCH SẢN PHẨM TỒN KHO`;
    titleRow.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FF000000' } };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A4:G4');
    const dateRow = worksheet.getCell('A4');
    dateRow.value = `Ngày xuất báo cáo: ${new Date().toLocaleDateString('vi-VN')}`;
    dateRow.font = { name: 'Arial', size: 10, italic: true };
    dateRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // 5. Header Bảng
    const headerRow = worksheet.addRow(['STT', 'Mã Hàng', 'Tên Hàng Hóa', 'Giá Bán (VNĐ)', 'Tồn Kho', 'Danh Mục Gốc', 'Cập Nhật Cuối']);
    headerRow.eachCell((cell) => {
      cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2196F3' } }; 
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // 6. Đổ dữ liệu
    let stt = 1;
    const sortedSuperCats = Object.values(tree).sort((a, b) => b.name.localeCompare(a.name)); 

    sortedSuperCats.forEach(sup => {
      // Dòng Cấp 1
      const rowL1 = worksheet.addRow([
        stt++, 
        "", 
        sup.name, 
        "", 
        `SL: ${sup.count} mã`, 
        "", 
        ""
      ]);
      rowL1.font = { name: 'Arial', size: 11, bold: true };
      rowL1.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE3F2FD' } }; 
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      Object.values(sup.subs).forEach(sub => {
        // Dòng Cấp 2
        const rowL2 = worksheet.addRow([
          "", 
          "", 
          `   • ${sub.name}`, 
          "", 
          `(${sub.count})`, 
          sub.name, 
          ""
        ]);
        rowL2.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF444444' } };
        rowL2.eachCell(cell => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });

        // Dòng Chi tiết
        sub.products.forEach(prod => {
            const rowL3 = worksheet.addRow([
                "",
                prod.code || "---",
                `         - ${prod.name}`, 
                Number(prod.price) || 0,
                Number(prod.stock) || 0,
                prod.category,
                new Date(prod.updatedAt).toLocaleDateString('vi-VN')
            ]);
            
            rowL3.getCell(4).numFmt = '#,##0 "₫"'; 
            rowL3.getCell(5).alignment = { horizontal: 'center' }; 

            rowL3.font = { name: 'Arial', size: 10 };
            rowL3.eachCell(cell => {
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            });
        });
      });
    });

    // 7. Dòng Tổng Cộng (CẬP NHẬT: THÊM TỔNG GIÁ TRỊ)
    // Cột 4: Tổng giá trị ước tính, Cột 5: Tổng tồn kho
    const totalRow = worksheet.addRow(["", "TỔNG CỘNG", "", totalValue, totalStock, "", ""]);
    
    totalRow.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFF0000' } };
    totalRow.getCell(4).numFmt = '#,##0 "₫"'; // Format tiền cho cột tổng giá trị
    totalRow.getCell(5).alignment = { horizontal: 'center' };
    
    totalRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }; // Vàng
        cell.border = { top: { style: 'medium' }, left: { style: 'thin' }, bottom: { style: 'medium' }, right: { style: 'thin' } };
    });

    // 8. Footer
    worksheet.addRow([]);
    worksheet.addRow([]);
    const footerRow1 = worksheet.addRow(["", "Người lập biểu", "", "", "Thủ kho", "", "Giám đốc"]);
    const footerRow2 = worksheet.addRow(["", "(Ký, họ tên)", "", "", "(Ký, họ tên)", "", "(Ký, họ tên, đóng dấu)"]);
    
    footerRow1.getCell(2).font = { bold: true }; 
    footerRow1.getCell(5).font = { bold: true }; 
    footerRow1.getCell(7).font = { bold: true }; 
    
    footerRow1.alignment = { horizontal: 'center' };
    footerRow2.alignment = { horizontal: 'center' };
    footerRow2.font = { italic: true, size: 10 };

    // 9. Xuất file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `DanhSachSanPham_PhanLoai_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`);
  };

  const searchValueChangeHandler = (e) => { setSearchValue(e.target.value); };
  const categoryChangeHandler = (e) => { setSelectedCategory(e.target.value); };

  return (
    <React.Fragment>
      {isLoading && <p>Đang tải dữ liệu ...</p>}
      {!isLoading && (
        <div className={classes.index}>
          <div className={classes.head}>
            <h3>Sản phẩm</h3>
            <div className={classes.buttonGroup}>
              <button 
                onClick={handleExportExcel} 
                className={classes.excelButton}
                disabled={isLoading || filteredProducts.length === 0}
                style={{ marginRight: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                📊 Xuất Excel Phân Loại
              </button>
              <button onClick={() => setLocation({ location: "new-product" })}>Thêm sản phẩm</button>
            </div>
          </div>

          <div className={classes.filters}>
            <input type="text" placeholder="Tìm theo Tên, Mã hàng..." value={searchValue} onChange={searchValueChangeHandler} />
            <select value={selectedCategory} onChange={categoryChangeHandler} className={classes.categorySelect}>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>{category === "all" ? "Tất cả danh mục" : category}</option>
              ))}
            </select>
          </div>

          {paginatedProducts && paginatedProducts.length > 0 ? (
            <>
              <Table products={paginatedProducts} setProducts={setProducts} />
              <div className={classes.paginationContainer}>
                 <p className={classes.totalCount}>Hiển thị {paginatedProducts.length} trên tổng số {filteredProducts.length} sản phẩm</p>
                {totalPages > 1 && (
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                )}
              </div>
            </>
          ) : ( <p>Không tìm thấy sản phẩm nào phù hợp.</p> )}
        </div>
      )}
    </React.Fragment>
  );
};

export default Products;