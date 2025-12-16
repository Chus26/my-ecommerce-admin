// // import React, { useState, useMemo } from "react"; // Thêm useMemo
// // //Css module
// // import classes from "./Products.module.css";

// // //React-router-dom
// // import { useSearchParams } from "react-router-dom";

// // //Dịch vụ Sản phẩm
// // import { axiosDeleteProductAdmin } from "../services/productServices";

// // //Lấy authtoken
// // import { getAuthToken } from "../utils/auth";

// // // Component Table (Giữ nguyên logic của bạn)
// // const Table = ({ products, setProducts }) => { // Bỏ prop 'search' và 'setProductsSearch' không cần thiết nữa
// //   const token = getAuthToken();
// //   const [, setLocation] = useSearchParams();

// //   const formatDateTime = (value) => {
// //     if (!value) return "—";
// //     return new Date(value).toLocaleString("vi-VN", {
// //       day: "2-digit",
// //       month: "2-digit",
// //       year: "numeric",
// //       hour: "2-digit",
// //       minute: "2-digit",
// //     });
// //   };

// //   const truncate = (str = "", n = 100) =>
// //     (str || "").length > n ? `${str.slice(0, n)}…` : str;

// //   const handleDelete = async (productId) => {
// //       if (window.confirm("Bạn có chắc muốn xoá sản phẩm này không?")) {
// //         try {
// //             const data = await axiosDeleteProductAdmin(token, productId);
// //             if (data?.message) {
// //               // Gọi setProducts để cập nhật state gốc ở component cha
// //               setProducts((prev) => prev.filter((p) => p._id !== productId));
// //               alert(data.message);
// //             } else {
// //               alert("Xoá thất bại!");
// //             }
// //         } catch (error) {
// //              alert("Có lỗi xảy ra khi xoá: " + (error.response?.data?.message || error.message));
// //         }
// //       }
// //   };


// //   return (
// //     <div className={classes.products}>
// //       <table>
// //         <thead>
// //           <tr>
// //             <th scope="col">Mã hàng</th>
// //             <th scope="col">Tên</th>
// //             <th scope="col">Mô tả</th>
// //             <th scope="col">Giá bán</th>
// //             <th scope="col">Ngày cập nhật</th>
// //             <th scope="col">Hình ảnh</th>
// //             <th scope="col">Danh mục</th>
// //             <th scope="col">Tồn kho</th>
// //             <th scope="col">Chỉnh sửa</th>
// //           </tr>
// //         </thead>

// //         {products.map((product, index) => {
// //           const shortDesc =
// //             product.short_desc || product.shortDescription || "";

// //           return (
// //             <tbody key={product._id}>
// //               <tr className={index % 2 === 0 ? `${classes.gray}` : ""}>
// //                 <td>{product.code || "—"}</td>
// //                 <td>{product.name}</td>
// //                 <td
// //                   className={classes.shortCell}
// //                   title={shortDesc}
// //                 >
// //                   {truncate(shortDesc, 100)}
// //                 </td>
// //                 <td>
// //                   {new Intl.NumberFormat("vi-VN", {
// //                     style: "currency",
// //                     currency: "VND",
// //                   }).format(Number(product.price) || 0)}
// //                 </td>
// //                 <td className={classes.dateCell}>
// //                   {formatDateTime(product.updatedAt || product.createdAt)}
// //                 </td>
// //                 <td>
// //                   {/* Đảm bảo img1 có giá trị trước khi render */}
// //                   {product.img1 && <img src={product.img1} alt={product.name} />}
// //                 </td>
// //                 <td>{product.category}</td>
// //                 <td className={classes.stockCell}>{Number(product.stock) || 0}</td>
// //                 <td>
// //                   <div className={classes.action}>
// //                     <button
// //                       onClick={() =>
// //                         setLocation({ location: `edit-product_${product._id}` })
// //                       }
// //                       className={classes.update}
// //                     >
// //                       Cập nhật
// //                     </button>
// //                     {/* Gọi hàm handleDelete khi nhấn nút Xoá */}
// //                     <button onClick={() => handleDelete(product._id)}>
// //                       Xoá
// //                     </button>
// //                   </div>
// //                 </td>
// //               </tr>
// //             </tbody>
// //           );
// //         })}
// //       </table>
// //     </div>
// //   );
// // };


// // // Component Products chính
// // const Products = ({ isLoading, products = [], setProducts }) => { // Thêm giá trị mặc định cho products
// //   const [, setLocation] = useSearchParams();
// //   const [searchValue, setSearchValue] = useState("");
// //   const [selectedCategory, setSelectedCategory] = useState("all"); // State cho bộ lọc danh mục

// //   // Lấy danh sách danh mục duy nhất từ products
// //   const uniqueCategories = useMemo(() => {
// //     const categories = new Set(products.map(p => p.category).filter(Boolean));
// //     return ["all", ...Array.from(categories)]; // Chuyển Set thành Array
// //   }, [products]);

// //   // Lọc sản phẩm dựa trên cả searchValue và selectedCategory
// //   const filteredProducts = useMemo(() => {
// //     const lowerCaseSearch = searchValue.toLowerCase().trim();

// //     return products.filter((product) => {
// //       // 1. Lọc theo danh mục
// //       const categoryMatch = selectedCategory === "all" || product.category?.toLowerCase() === selectedCategory.toLowerCase();
// //       if (!categoryMatch) {
// //           return false;
// //       }

// //       // 2. Lọc theo searchValue (Tên, Mã hàng)
// //       if (!lowerCaseSearch) {
// //           return true; // Nếu không có search term, chỉ cần khớp category
// //       }
// //       const productName = product.name?.toString().toLowerCase() || ''; // Thêm ?. và || '' để tránh lỗi nếu không có name
// //       const productCode = product.code?.toString().toLowerCase() || ''; // Thêm ?. và || ''

// //       return productName.includes(lowerCaseSearch) || productCode.includes(lowerCaseSearch);
// //     });
// //   }, [products, searchValue, selectedCategory]);


// //    const searchValueChangeHandler = (e) => {
// //      setSearchValue(e.target.value);
// //    };

// //   const categoryChangeHandler = (e) => {
// //     setSelectedCategory(e.target.value);
// //   }

// //   return (
// //     <React.Fragment>
// //       {isLoading && <p>Đang tải dữ liệu ...</p>}
// //       {!isLoading && (
// //         <div className={classes.index}>
// //           <div className={classes.head}>
// //             <h3>Sản phẩm</h3>
// //             <button onClick={() => setLocation({ location: "new-product" })}>
// //               Thêm sản phẩm
// //             </button>
// //           </div>

// //           {/* Khu vực Bộ lọc */}
// //           <div className={classes.filters}> {/* Bạn có thể thêm style cho class này trong CSS */}
// //             <input
// //               type="text"
// //               placeholder="Tìm theo Tên, Mã hàng..."
// //               value={searchValue}
// //               onChange={searchValueChangeHandler}
// //             />

// //             <select value={selectedCategory} onChange={categoryChangeHandler} className={classes.categorySelect}> {/* Thêm class CSS nếu muốn */}
// //               {uniqueCategories.map(category => (
// //                 <option key={category} value={category}>
// //                   {category === "all" ? "Tất cả danh mục" : category}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           {/* Hiển thị bảng hoặc thông báo */}
// //           {filteredProducts && filteredProducts.length > 0 ? (
// //             <Table
// //               products={filteredProducts} // Luôn truyền danh sách đã lọc
// //               setProducts={setProducts} // Cần để cập nhật state gốc khi xoá
// //               // Bỏ search và setProductsSearch không cần thiết
// //             />
// //           ) : (
// //             <p>Không tìm thấy sản phẩm nào phù hợp.</p>
// //           )}
// //         </div>
// //       )}
// //     </React.Fragment>
// //   );
// // };

// // export default Products;

// import React, { useState, useMemo, useEffect } from "react"; // Thêm useEffect
// //Css module
// import classes from "./Products.module.css";

// //React-router-dom
// import { useSearchParams } from "react-router-dom";

// //Dịch vụ Sản phẩm
// import { axiosDeleteProductAdmin } from "../services/productServices";

// //Lấy authtoken
// import { getAuthToken } from "../utils/auth";

// // ===============================================
// // Component Pagination (Mới)
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
//     const maxPagesToShow = 5; // Hiển thị tối đa 5 nút số
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
//         pages.push("..."); // Dùng string để phân biệt
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
// // Component Table (Giữ nguyên)
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
//             <button onClick={() => setLocation({ location: "new-product" })}>
//               Thêm sản phẩm
//             </button>
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

// ===== FILE: src/components/Products.jsx (HOÀN CHỈNH - ADMIN PRODUCT) =====

import React, { useState, useMemo, useEffect } from "react";
// ✅ 1. IMPORT THƯ VIỆN XLSX
import * as XLSX from "xlsx";
//Import css module
import classes from "./Products.module.css";

//React-router-dom
import { useSearchParams } from "react-router-dom";

//Dịch vụ Sản phẩm & Auth
import { axiosDeleteProductAdmin } from "../services/productServices";
import { getAuthToken } from "../utils/auth";


// ===============================================
// Component Pagination (Lô gic phân trang)
// ===============================================
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  // Logic để tạo ra các số trang (vd: 1 ... 4 5 6 ... 10)
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; 
    const half = Math.floor(maxPagesToShow / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage - half < 1) {
      end = Math.min(totalPages, maxPagesToShow);
    }

    if (currentPage + half > totalPages) {
      start = Math.max(1, totalPages - maxPagesToShow + 1);
    }
    
    // Luôn thêm trang 1
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push("..."); 
      }
    }

    // Các trang ở giữa
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Luôn thêm trang cuối
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={classes.pagination}>
      <button onClick={handlePrev} disabled={currentPage === 1}>
        « Trước
      </button>
      {pageNumbers.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={page === currentPage ? classes.activePage : ""}
          >
            {page}
          </button>
        ) : (
          <span key={`dots-${index}`} className={classes.dots}>
            ...
          </span>
        )
      )}
      <button onClick={handleNext} disabled={currentPage === totalPages}>
        Sau »
      </button>
    </div>
  );
};


// ===============================================
// Component Table (Bảng hiển thị sản phẩm)
// ===============================================
const Table = ({ products, setProducts }) => {
  const token = getAuthToken();
  const [, setLocation] = useSearchParams();

  const formatDateTime = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncate = (str = "", n = 100) =>
    (str || "").length > n ? `${str.slice(0, n)}…` : str;

  const handleDelete = async (productId) => {
    if (window.confirm("Bạn có chắc muốn xoá sản phẩm này không?")) {
      try {
        const data = await axiosDeleteProductAdmin(token, productId);
        if (data?.message) {
          // Gọi setProducts để cập nhật state gốc ở component cha
          setProducts((prev) => prev.filter((p) => p._id !== productId));
          alert(data.message);
        } else {
          alert("Xoá thất bại!");
        }
      } catch (error) {
        alert(
          "Có lỗi xảy ra khi xoá: " +
            (error.response?.data?.message || error.message)
        );
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
          const shortDesc =
            product.short_desc || product.shortDescription || "";

          return (
            <tbody key={product._id}>
              <tr className={index % 2 === 0 ? `${classes.gray}` : ""}>
                <td>{product.code || "—"}</td>
                <td>{product.name}</td>
                <td className={classes.shortCell} title={shortDesc}>
                  {truncate(shortDesc, 100)}
                </td>
                <td>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(Number(product.price) || 0)}
                </td>
                <td className={classes.dateCell}>
                  {formatDateTime(product.updatedAt || product.createdAt)}
                </td>
                <td>
                  {product.img1 && <img src={product.img1} alt={product.name} />}
                </td>
                <td>{product.category}</td>
                <td className={classes.stockCell}>
                  {Number(product.stock) || 0}
                </td>
                <td>
                  <div className={classes.action}>
                    <button
                      onClick={() =>
                        setLocation({ location: `edit-product_${product._id}` })
                      }
                      className={classes.update}
                    >
                      Cập nhật
                    </button>
                    <button onClick={() => handleDelete(product._id)}>
                      Xoá
                    </button>
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
// Component Products chính (CẬP NHẬT)
// ===============================================
const ITEMS_PER_PAGE = 10; // Đặt số lượng sản phẩm mỗi trang

const Products = ({ isLoading, products = [], setProducts }) => {
  const [, setLocation] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1); // State cho trang hiện tại

  // Lấy danh sách danh mục duy nhất (Giữ nguyên)
  const uniqueCategories = useMemo(() => {
    const categories = new Set(products.map((p) => p.category).filter(Boolean));
    return ["all", ...Array.from(categories)];
  }, [products]);

  // Lọc sản phẩm (Giữ nguyên logic lọc)
  const filteredProducts = useMemo(() => {
    const lowerCaseSearch = searchValue.toLowerCase().trim();

    return products.filter((product) => {
      // 1. Lọc theo danh mục
      const categoryMatch =
        selectedCategory === "all" ||
        product.category?.toLowerCase() === selectedCategory.toLowerCase();
      if (!categoryMatch) {
        return false;
      }

      // 2. Lọc theo searchValue (Tên, Mã hàng)
      if (!lowerCaseSearch) {
        return true;
      }
      const productName = product.name?.toString().toLowerCase() || "";
      const productCode = product.code?.toString().toLowerCase() || "";

      return (
        productName.includes(lowerCaseSearch) ||
        productCode.includes(lowerCaseSearch)
      );
    });
  }, [products, searchValue, selectedCategory]);

  // TÍNH TOÁN PHÂN TRANG
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Cắt (slice) danh sách sản phẩm để chỉ hiển thị cho trang hiện tại
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);


  // QUAN TRỌNG: Reset về trang 1 khi người dùng lọc hoặc tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, selectedCategory]);


  // ✅ 2. HÀM XUẤT EXCEL CHO SẢN PHẨM (MỚI THÊM)
  const handleExportExcel = () => {
    if (isLoading || !filteredProducts || filteredProducts.length === 0) {
      alert("Chưa có dữ liệu sản phẩm để xuất!");
      return;
    }

    // Chuẩn bị dữ liệu cho Excel
    const dataForExcel = filteredProducts.map((product) => ({
      "Mã Hàng": product.code || "",
      "Tên Sản Phẩm": product.name || "",
      "Danh Mục": product.category || "",
      "Giá Bán (VND)": product.price || 0,
      "Tồn Kho": product.stock || 0,
      "Phụ Kiện?": product.isAccessory ? "Có" : "Không",
      // Ghép mảng tags thành chuỗi "tag1, tag2"
      "Tags AI": product.compatibilityTags?.join(', ') || "",
      "Ngày Cập Nhật": new Date(product.updatedAt).toLocaleDateString("vi-VN"),
    }));

    // Tạo Sheet
    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    
    // Định dạng độ rộng cột
    ws["!cols"] = [
      { wch: 15 }, // Mã hàng
      { wch: 40 }, // Tên
      { wch: 15 }, // Danh mục
      { wch: 15 }, // Giá bán
      { wch: 10 }, // Tồn kho
      { wch: 10 }, // Phụ kiện?
      { wch: 45 }, // Tags AI
      { wch: 20 }  // Ngày cập nhật
    ];

    // Tạo Workbook và Xuất file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachSanPham");
    
    const fileName = `Bao_cao_san_pham_${new Date().toLocaleDateString("vi-VN")}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };


  const searchValueChangeHandler = (e) => {
    setSearchValue(e.target.value);
  };

  const categoryChangeHandler = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <React.Fragment>
      {isLoading && <p>Đang tải dữ liệu ...</p>}
      {!isLoading && (
        <div className={classes.index}>
          <div className={classes.head}>
            <h3>Sản phẩm</h3>
            {/* ✅ 3. THÊM NÚT EXCEL VÀO HEADER */}
            <div className={classes.buttonGroup}>
                <button 
                    onClick={handleExportExcel} 
                    className={classes.excelButton}
                    disabled={isLoading || filteredProducts.length === 0}
                    style={{ marginRight: '10px', backgroundColor: '#28a745' }} // Style nhanh
                >
                    📊 Xuất Excel ({filteredProducts.length} SP)
                </button>
                <button onClick={() => setLocation({ location: "new-product" })}>
                    Thêm sản phẩm
                </button>
            </div>
          </div>

          {/* Khu vực Bộ lọc (Giữ nguyên) */}
          <div className={classes.filters}>
            <input
              type="text"
              placeholder="Tìm theo Tên, Mã hàng..."
              value={searchValue}
              onChange={searchValueChangeHandler}
            />
            <select
              value={selectedCategory}
              onChange={categoryChangeHandler}
              className={classes.categorySelect}
            >
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "Tất cả danh mục" : category}
                </option>
              ))}
            </select>
          </div>

          {/* Hiển thị bảng hoặc thông báo */}
          {paginatedProducts && paginatedProducts.length > 0 ? (
            <>
              <Table
                products={paginatedProducts} // <-- Chỉ truyền sản phẩm của trang này
                setProducts={setProducts} 
              />
              {/* === THÊM KHU VỰC PHÂN TRANG === */}
              <div className={classes.paginationContainer}>
                 <p className={classes.totalCount}>
                  Hiển thị {paginatedProducts.length} trên tổng số {filteredProducts.length} sản phẩm
                 </p>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage} // Truyền hàm setCurrentPage
                  />
                )}
              </div>
            </>
          ) : (
            <p>Không tìm thấy sản phẩm nào phù hợp.</p>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default Products;