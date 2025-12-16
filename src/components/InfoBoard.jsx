// // // ===== FILE: InfoBoard.jsx (Đã cập nhật real-time, đã fix lỗi copy) =====

// // import React, { useState, useEffect, useCallback } from "react";
// // import classes from "./InfoBoard.module.css";
// // import { useSearchParams } from "react-router-dom";

// // // Dịch vụ Sản phẩm
// // import { axiosGetProducts, axiosGetProductEdit } from "../services/productServices";

// // // Dịch vụ Đơn hàng
// // import { axiosGetOrdersAdminDashBoard } from "../services/orderServices";

// // import { getAuthToken } from "../utils/auth";
// // import { useSelector } from "react-redux";

// // // Components
// // import Products from "./Products";
// // import Dashboard from "./Dashboard";
// // import ProductForm from "./ProductForm";
// // import SuggestionCheck from "./SuggestionCheck";
// // import UserManagement from "./UserManagement";


// // import socket from "../utils/socket-io.js"; // Thêm socket

// // const InfoBoard = () => {
// //   // Query vị trí (location)
// //   const [location] = useSearchParams({ location: "" });

// //   // Trạng thái tải
// //   const [isLoading, setIsLoading] = useState(false);

// //   // Vai trò người dùng
// //   const { userRole } = useSelector((state) => state.auth);

// //   // State danh sách sản phẩm
// //   const [products, setProducts] = useState([]);

// //   // State sản phẩm đang chỉnh sửa
// //   const [product, setProduct] = useState(null);

// //   // State thống kê
// //   const [statistic, setStatistic] = useState({
// //     users: 0,
// //     orders: 0,
// //     successfulOrders: 0,
// //     totalEarnings: 0,
// //     averageOfMonths: 0,
// //     earningsOfMonth: 0,
// //   });

// //   // Đơn hàng mới nhất
// //   const [lastestOrders, setLastestOrders] = useState([]);

// //   // Xác định path và id sản phẩm
// //   const path = location.get("location");
// //   const productId = path?.split("_")[1]?.toString();

// //   // Hàm fetch dữ liệu dashboard
// //   const fetchDashboardData = useCallback(async () => {
// //     const token = getAuthToken();
// //     if (!token || userRole !== "admin") {
// //       setIsLoading(false);
// //       return;
// //     }

// //     if (!path) {
// //       setIsLoading(true);
// //     }

// //     try {
// //       const data = await axiosGetOrdersAdminDashBoard(token);
// //       if (data) {
// //         setStatistic({
// //           users: data.totalUsers || 0,
// //           orders: data.totalOrders || 0,
// //           successfulOrders: data.successfulOrders || 0, // <-- LẤY TỪ API
// //           totalEarnings: data.earnings || 0,
// //           averageOfMonths: data.balance || 0,
// //           earningsOfMonth: data.totalCurrentMonthRevenue || 0,
// //         });
// //         setLastestOrders(data.lastestOrders || []);
// //       } else {
// //         console.warn("API getAdminDashBoardOrders did not return data.");
// //         setStatistic({
// //           users: 0,
// //           orders: 0,
// //           successfulOrders: 0,
// //           totalEarnings: 0,
// //           averageOfMonths: 0,
// //           earningsOfMonth: 0,
// //         });
// //         setLastestOrders([]);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching dashboard data:", error);
// //       setStatistic({
// //         users: 0,
// //         orders: 0,
// //         successfulOrders: 0,
// //         totalEarnings: 0,
// //         averageOfMonths: 0,
// //         earningsOfMonth: 0,
// //       });
// //       setLastestOrders([]);
// //     } finally {
// //       if (!path) {
// //         setIsLoading(false);
// //       }
// //     }
// //   }, [userRole, path]);

// //   // Fetch dữ liệu theo path
// //   useEffect(() => {
// //     const token = getAuthToken();
// //     if (!token || userRole !== "admin") {
// //       setIsLoading(false);
// //       return;
// //     }

// //     if (!path) {
// //       fetchDashboardData();
// //     } else if (path === "products") {
// //       const getProducts = async () => {
// //         setIsLoading(true);
// //         try {
// //           const data = await axiosGetProducts();
// //           setProducts(data || []);
// //         } catch (error) {
// //           console.error("Error fetching products:", error);
// //           setProducts([]);
// //         } finally {
// //           setIsLoading(false);
// //         }
// //       };
// //       getProducts();
// //     } else if (path.includes("edit-product") && productId) {
// //       const getProduct = async () => {
// //         setIsLoading(true);
// //         try {
// //           const data = await axiosGetProductEdit(token, productId);
// //           setProduct(data || null);
// //         } catch (error) {
// //           console.error("Error fetching product for edit:", error);
// //           setProduct(null);
// //         } finally {
// //           setIsLoading(false);
// //         }
// //       };
// //       getProduct();
// //     } else if (path.includes("suggestion")) {
// //       setIsLoading(false);
// //     } else {
// //       setIsLoading(false);
// //     }
// //   }, [path, userRole, fetchDashboardData, productId]);

// //   // Lắng nghe socket cập nhật đơn hàng real-time
// //   // useEffect(() => {
// //   //   if (userRole === "admin") {
// //   //     const handleOrderUpdate = (data) => {
// //   //       const { action } = data;
// //   //       if (action === "ADMIN_UPDATED_STATUS" || action === "USER_CANCELED") {
// //   //         console.log(
// //   //           "InfoBoard (Dashboard Listener): Phát hiện thay đổi đơn hàng, tải lại dữ liệu tổng quan..."
// //   //         );
// //   //         if (!path) {
// //   //           fetchDashboardData();
// //   //         }
// //   //       }
// //   //     };

// //   //     socket.on("order", handleOrderUpdate);
// //   //     return () => socket.off("order", handleOrderUpdate);
// //   //   }
// //   // }, [path, userRole, fetchDashboardData]);
// //   // Lắng nghe socket cập nhật đơn hàng real-time
// //   useEffect(() => {
// //     if (userRole === "admin") {
// //       const handleOrderUpdate = (data) => {
// //         // Lấy cả action và order từ data
// //         const { action, order } = data;

// //         // Xử lý khi có đơn hàng mới
// //         if (action === "NEW_ORDER") {
// //           console.log("InfoBoard: Socket received NEW_ORDER");
// //           // Chỉ cập nhật state nếu đang ở trang dashboard
// //           if (!path) {
// //             // Tăng tổng số đơn hàng
// //             setStatistic((prevStat) => ({
// //               ...prevStat,
// //               orders: prevStat.orders + 1,
// //             }));
// //             // Thêm đơn hàng mới vào đầu danh sách lastestOrders
// //             setLastestOrders((prevOrders) => [order, ...prevOrders]);
// //             // Có thể cập nhật thêm earningsOfMonth, averageOfMonths nếu cần
// //           }
// //           return; // Dừng xử lý cho NEW_ORDER
// //         }

// //         // Xử lý khi trạng thái đơn hàng thay đổi hoặc bị hủy
// //         if (action === "ADMIN_UPDATED_STATUS" || action === "USER_CANCELED") {
// //           console.log(
// //             "InfoBoard: Order status changed/canceled, refetching dashboard data..."
// //           );
// //           // Chỉ fetch lại nếu đang ở trang dashboard chính
// //           if (!path) {
// //             fetchDashboardData(); // Fetch lại toàn bộ để cập nhật tất cả số liệu
// //           } else {
// //             // Nếu không ở dashboard, chỉ cần cập nhật list đơn hàng
// //             setLastestOrders((prevOrders) =>
// //               prevOrders.map((o) => (o._id === order._id ? order : o))
// //             );
// //           }
// //         }
// //       };

// //       socket.on("order", handleOrderUpdate);
// //       return () => socket.off("order", handleOrderUpdate);
// //     }
// //   }, [path, userRole, fetchDashboardData]);


// //   return (
// //     <div className={classes.info}>
// //       {/* Dashboard */}
// //       {!path && userRole === "admin" && (
// //         <Dashboard
// //           isLoading={isLoading}
// //           statistic={statistic}
// //           orders={lastestOrders}
// //         />
// //       )}

// //       {/* Danh sách sản phẩm */}
// //       {path === "products" && userRole === "admin" && (
// //         <Products
// //           isLoading={isLoading}
// //           products={products}
// //           setProducts={setProducts}
// //         />
// //       )}

// //       {/* Tạo sản phẩm */}
// //       {path === "new-product" && userRole === "admin" && <ProductForm />}

// //       {/* Chỉnh sửa sản phẩm */}
// //       {path.includes("edit-product") &&
// //         productId &&
// //         !isLoading &&
// //         userRole === "admin" &&
// //         product && (
// //           <ProductForm
// //             editing
// //             productEdit={product}
// //             productId={productId}
// //           />
// //         )}

// //       {path.includes("edit-product") && productId && isLoading && (
// //         <p>Đang tải sản phẩm...</p>
// //       )}
// //       {path.includes("edit-product") && productId && !isLoading && !product && (
// //         <p>Không tìm thấy sản phẩm.</p>
// //       )}

// //       {/* Live chat */}
// //       {path === "suggestion" && <SuggestionCheck />}
// //     </div>
// //   );
// // };

// // export default InfoBoard;

// // ===== FILE: src/components/InfoBoard.jsx =====

// import React, { useState, useEffect, useCallback } from "react";
// import classes from "./InfoBoard.module.css";
// import { useSearchParams } from "react-router-dom";
// import { axiosGetProducts, axiosGetProductEdit } from "../services/productServices";
// import { axiosGetOrdersAdminDashBoard } from "../services/orderServices";
// import { getAuthToken } from "../utils/auth";
// import { useSelector } from "react-redux";
// import Products from "./Products";
// import Dashboard from "./Dashboard";
// import ProductForm from "./ProductForm";
// import SuggestionCheck from "./SuggestionCheck";
// import UserManagement from "./UserManagement";
// import socket from "../utils/socket-io.js";
// import TagsPage from "../pages/TagsPage";


// const InfoBoard = () => {
//   const [location] = useSearchParams({ location: "" });
//   const [isLoading, setIsLoading] = useState(false);
//   const { userRole } = useSelector((state) => state.auth);
//   const [products, setProducts] = useState([]);
//   const [product, setProduct] = useState(null);
//   const [statistic, setStatistic] = useState({
//     users: 0,
//     orders: 0,
//     successfulOrders: 0,
//     totalEarnings: 0,
//     averageOfMonths: 0,
//     earningsOfMonth: 0,
//   });
//   const [lastestOrders, setLastestOrders] = useState([]);

//   const path = location.get("location");
//   const productId = path?.split("_")[1]?.toString();

//   const fetchDashboardData = useCallback(async () => {
//     const token = getAuthToken();
//     if (!token || userRole !== "admin") {
//       setIsLoading(false);
//       return;
//     }

//     if (!path) setIsLoading(true);

//     try {
//       const data = await axiosGetOrdersAdminDashBoard(token);
//       if (data) {
//         setStatistic({
//           users: data.totalUsers || 0,
//           orders: data.totalOrders || 0,
//           successfulOrders: data.successfulOrders || 0,
//           totalEarnings: data.earnings || 0,
//           averageOfMonths: data.balance || 0,
//           earningsOfMonth: data.totalCurrentMonthRevenue || 0,
//         });
//         setLastestOrders(data.lastestOrders || []);
//       } else {
//         setStatistic({
//           users: 0,
//           orders: 0,
//           successfulOrders: 0,
//           totalEarnings: 0,
//           averageOfMonths: 0,
//           earningsOfMonth: 0,
//         });
//         setLastestOrders([]);
//       }
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//       setStatistic({
//         users: 0,
//         orders: 0,
//         successfulOrders: 0,
//         totalEarnings: 0,
//         averageOfMonths: 0,
//         earningsOfMonth: 0,
//       });
//       setLastestOrders([]);
//     } finally {
//       if (!path) setIsLoading(false);
//     }
//   }, [userRole, path]);

//   useEffect(() => {
//     const token = getAuthToken();
//     if (!token || !(userRole === "admin" || userRole === "consultant")) {
//       setIsLoading(false);
//       return;
//     }

//     if (!path) {
//       if (userRole === "admin") fetchDashboardData();
//     } else if (path === "products") {
//       const getProducts = async () => {
//         setIsLoading(true);
//         try {
//           const data = await axiosGetProducts();
//           setProducts(data || []);
//         } catch (error) {
//           console.error("Error fetching products:", error);
//           setProducts([]);
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       getProducts();
//     } else if (path.includes("edit-product") && productId) {
//       const getProduct = async () => {
//         setIsLoading(true);
//         try {
//           const data = await axiosGetProductEdit(token, productId);
//           setProduct(data || null);
//         } catch (error) {
//           console.error("Error fetching product for edit:", error);
//           setProduct(null);
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       getProduct();
//     } else if (path.includes("suggestion") || path.includes("live-chat")) {
//       setIsLoading(false);
//     } else if (path === "users") {
//       setIsLoading(false);
//     } else if (path === "tags") {
//       setIsLoading(false);
//     } else {
//       setIsLoading(false);
//     }

//   }, [path, userRole, fetchDashboardData, productId]);

//   useEffect(() => {
//     if (userRole === "admin") {
//       const handleOrderUpdate = (data) => {
//         const { action, order } = data;

//         if (action === "NEW_ORDER") {
//           console.log("InfoBoard: Socket received NEW_ORDER");
//           if (!path) {
//             setStatistic((prev) => ({
//               ...prev,
//               orders: prev.orders + 1,
//             }));
//             setLastestOrders((prev) => [order, ...prev].slice(0, 8));
//           }
//           return;
//         }

//         if (action === "ADMIN_UPDATED_STATUS" || action === "USER_CANCELED") {
//           console.log("InfoBoard: Order status changed, refetching dashboard data...");
//           if (!path) {
//             fetchDashboardData();
//           } else {
//             setLastestOrders((prev) =>
//               prev.map((o) => (o._id === order._id ? order : o))
//             );
//           }
//         }
//       };

//       socket.on("order", handleOrderUpdate);
//       return () => socket.off("order", handleOrderUpdate);
//     }
//   }, [path, userRole, fetchDashboardData]);


//   return (
//     <div className={classes.info}>
//       {!path && userRole === "admin" && (
//         <Dashboard
//           isLoading={isLoading}
//           statistic={statistic}
//           orders={lastestOrders}
//         />
//       )}

//       {path === "products" &&
//         (userRole === "admin" || userRole === "consultant") && (
//           <Products
//             isLoading={isLoading}
//             products={products}
//             setProducts={setProducts}
//           />
//         )}

//       {path === "new-product" &&
//         (userRole === "admin" || userRole === "consultant") && <ProductForm />}

//       {path.includes("edit-product") &&
//         productId &&
//         !isLoading &&
//         (userRole === "admin" || userRole === "consultant") &&
//         product && (
//           <ProductForm
//             editing
//             productEdit={product}
//             productId={productId}
//           />
//         )}

//       {path.includes("edit-product") && productId && isLoading && (
//         <p>Đang tải sản phẩm...</p>
//       )}

//       {path.includes("edit-product") && productId && !isLoading && !product && (
//         <p>Không tìm thấy sản phẩm.</p>
//       )}

//       {(path === "suggestion" || path.includes("live-chat")) &&
//         (userRole === "admin" || userRole === "consultant") && (
//           <SuggestionCheck />
//         )}

//       {path === "users" && userRole === "admin" && <UserManagement />}
//       {path === "tags" && userRole === "admin" && <TagsPage />}
//     </div>
//   );
// };

// export default InfoBoard;

// ===== FILE: src/components/InfoBoard.jsx (ĐÃ DỌN DẸP 'lastestOrders') =====

import React, { useState, useEffect, useCallback } from "react";
import classes from "./InfoBoard.module.css";
import { useSearchParams } from "react-router-dom";
import {
  axiosGetProducts,
  axiosGetProductEdit,
} from "../services/productServices";
import { axiosGetOrdersAdminDashBoard } from "../services/orderServices";
import { getAuthToken } from "../utils/auth";
import { useSelector } from "react-redux";

// Components
import Products from "./Products";
import Dashboard from "./Dashboard";
import ProductForm from "./ProductForm";
import SuggestionCheck from "./SuggestionCheck";
import UserManagement from "./UserManagement";
import TagsPage from "../pages/TagsPage";
import socket from "../utils/socket-io.js";
import OrderManagement from "./OrderManagement";

const InfoBoard = () => {
  const [location] = useSearchParams({ location: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { userRole } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [statistic, setStatistic] = useState({
    users: 0,
    orders: 0,
    successfulOrders: 0,
    totalEarnings: 0,
    averageOfMonths: 0,
    earningsOfMonth: 0,
  });
  
  // const [lastestOrders, setLastestOrders] = useState([]); // <-- ĐÃ XÓA
  const [allOrders, setAllOrders] = useState([]);

  const path = location.get("location");
  const productId = path?.split("_")[1]?.toString();

  const fetchAdminData = useCallback(async () => {
    const token = getAuthToken();
    if (!token || userRole !== "admin") return;

    if (!path || path === "orders") setIsLoading(true);

    try {
      const data = await axiosGetOrdersAdminDashBoard(token);
      
      if (data) {
        setStatistic({
          users: data.totalUsers || 0,
          orders: data.totalOrders || 0,
          successfulOrders: data.successfulOrders || 0,
          totalEarnings: data.earnings || 0,
          averageOfMonths: data.balance || 0,
          earningsOfMonth: data.totalCurrentMonthRevenue || 0,
        });
        
        // setLastestOrders(data.lastestOrders || []); // <-- ĐÃ XÓA
        setAllOrders(data.orders || []);
      } else {
        setStatistic({ users: 0, orders: 0, successfulOrders: 0, totalEarnings: 0, averageOfMonths: 0, earningsOfMonth: 0 });
        // setLastestOrders([]); // <-- ĐÃ XÓA
        setAllOrders([]);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setStatistic({ users: 0, orders: 0, successfulOrders: 0, totalEarnings: 0, averageOfMonths: 0, earningsOfMonth: 0 });
      // setLastestOrders([]); // <-- ĐÃ XÓA
      setAllOrders([]);
    } finally {
      if (!path || path === "orders") setIsLoading(false);
    }
  }, [userRole, path]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token || !(userRole === "admin" || userRole === "consultant")) {
      setIsLoading(false);
      return;
    }

    if (!path || path === "orders") {
      if (userRole === "admin") fetchAdminData();
    } 
    else if (path === "products") {
      const getProducts = async () => {
        setIsLoading(true);
        try {
          const data = await axiosGetProducts();
          setProducts(data || []);
        } catch (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
        } finally {
          setIsLoading(false);
        }
      };
      getProducts();
    } 
    else if (path.includes("edit-product") && productId) {
      const getProduct = async () => {
        setIsLoading(true);
        try {
          const data = await axiosGetProductEdit(token, productId);
          setProduct(data || null);
        } catch (error) {
          console.error("Error fetching product for edit:", error);
          setProduct(null);
        } finally {
          setIsLoading(false);
        }
      };
      getProduct();
    } 
    else if (
      path === "new-product" ||
      path.includes("suggestion") ||
      path.includes("live-chat") ||
      path === "users" ||
      path === "tags"
    ) {
      setIsLoading(false);
    } 
    else {
      setIsLoading(false);
    }
  }, [path, userRole, fetchAdminData, productId]);

  useEffect(() => {
    if (userRole === "admin") {
      const handleOrderUpdate = (data) => {
        const { action } = data;
        
        if (action === "NEW_ORDER" || action === "ADMIN_UPDATED_STATUS" || action === "USER_CANCELED") {
          console.log("InfoBoard: Socket detected order change, refetching admin data...");
          fetchAdminData(); 
          
          // Dòng code cập nhật 'lastestOrders' đã bị xóa
          // if (action === "NEW_ORDER" && !path) {
          //   setLastestOrders((prev) => [order, ...prev].slice(0, 8)); // <-- ĐÃ XÓA
          // }
        }
      };

      socket.on("order", handleOrderUpdate);
      return () => socket.off("order", handleOrderUpdate);
    }
  }, [userRole, fetchAdminData]); // 'path' đã bị xóa khỏi dependency array vì 'fetchAdminData' đã có 'path'


  return (
    <div className={classes.info}>
      {/* Dashboard không còn nhận prop 'orders' */}
      {!path && userRole === "admin" && (
        <Dashboard
          isLoading={isLoading}
          statistic={statistic}
        />
      )}

      {/* Trang Quản lý Đơn hàng */}
      {path === "orders" && userRole === "admin" && (
        <OrderManagement 
          isLoading={isLoading} 
          orders={allOrders} 
        />
      )}

      {/* (Các component còn lại giữ nguyên) */}
      {path === "products" &&
        (userRole === "admin" || userRole === "consultant") && (
          <Products
            isLoading={isLoading}
            products={products}
            setProducts={setProducts}
          />
        )}

      {path === "new-product" &&
        (userRole === "admin" || userRole === "consultant") && <ProductForm />}

      {path.includes("edit-product") &&
        productId &&
        !isLoading &&
        (userRole === "admin" || userRole === "consultant") &&
        product && (
          <ProductForm
            editing
            productEdit={product}
            productId={productId}
          />
        )}

      {path.includes("edit-product") && productId && isLoading && (
        <p>Đang tải sản phẩm...</p>
      )}

      {path.includes("edit-product") && productId && !isLoading && !product && (
        <p>Không tìm thấy sản phẩm.</p>
      )}

      {(path === "suggestion" || path.includes("live-chat")) &&
        (userRole === "admin" || userRole === "consultant") && (
          <SuggestionCheck />
        )}

      {path === "users" && userRole === "admin" && <UserManagement />}
      {path === "tags" && userRole === "admin" && <TagsPage />}
    </div>
  );
};

export default InfoBoard;