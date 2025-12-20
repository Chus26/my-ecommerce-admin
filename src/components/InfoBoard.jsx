// export default InfoBoard;

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
import CategoryStats from "./CategoryStats";

const InfoBoard = () => {
  const [location] = useSearchParams({ location: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { userRole } = useSelector((state) => state.auth);

  // --- STATE ---
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);

  // ✅ 1. State quản lý năm (Mặc định năm hiện tại)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [statistic, setStatistic] = useState({
    users: 0,
    orders: 0,
    successfulOrders: 0,
    totalEarnings: 0,
    earningsOfMonth: 0,
  });

  const [allOrders, setAllOrders] = useState([]);

  const path = location.get("location");
  const productId = path?.split("_")[1]?.toString();

  // --- HÀM FETCH DỮ LIỆU ADMIN ---
  const fetchAdminData = useCallback(async () => {
    const token = getAuthToken();
    if (!token || userRole !== "admin") return;

    // Chỉ hiện loading khi ở trang dashboard hoặc trang quản lý đơn hàng
    if (!path || path === "orders") setIsLoading(true);

    try {
      // ✅ 2. Truyền selectedYear vào API service
      const data = await axiosGetOrdersAdminDashBoard(token, selectedYear);

      if (data) {
        setStatistic({
          users: data.totalUsers || 0,
          orders: data.totalOrders || 0,
          successfulOrders: data.successfulOrders || 0,
          totalEarnings: data.earnings || 0,
          earningsOfMonth: data.totalCurrentMonthRevenue || 0,
        });

        setAllOrders(data.orders || []);
      } else {
        // Reset nếu không có dữ liệu
        setStatistic({
          users: 0,
          orders: 0,
          successfulOrders: 0,
          totalEarnings: 0,
          earningsOfMonth: 0,
        });
        setAllOrders([]);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setStatistic({
        users: 0,
        orders: 0,
        successfulOrders: 0,
        totalEarnings: 0,
        earningsOfMonth: 0,
      });
      setAllOrders([]);
    } finally {
      if (!path || path === "orders") setIsLoading(false);
    }
  }, [userRole, path, selectedYear]); // ✅ Thêm selectedYear vào dependency

  // --- USE EFFECT INITIAL FETCH & ROUTING ---
  useEffect(() => {
    const token = getAuthToken();
    if (!token || !(userRole === "admin" || userRole === "consultant")) {
      setIsLoading(false);
      return;
    }

    if (!path || path === "orders") {
      if (userRole === "admin") fetchAdminData();
    } else if (path === "products") {
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
    } else if (path.includes("edit-product") && productId) {
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
    } else if (
      path === "new-product" ||
      path.includes("suggestion") ||
      path.includes("live-chat") ||
      path === "users" ||
      path === "tags" ||
      path === "category-stats"
    ) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [path, userRole, fetchAdminData, productId]);

  // --- SOCKET IO LISTENER ---
  useEffect(() => {
    if (userRole === "admin") {
      const handleOrderUpdate = (data) => {
        const { action } = data;

        if (
          action === "NEW_ORDER" ||
          action === "ADMIN_UPDATED_STATUS" ||
          action === "USER_CANCELED"
        ) {
          console.log(
            "InfoBoard: Socket detected order change, refetching admin data..."
          );
          fetchAdminData();
        }
      };

      socket.on("order", handleOrderUpdate);
      return () => socket.off("order", handleOrderUpdate);
    }
  }, [userRole, fetchAdminData]);

  return (
    <div className={classes.info}>
      {/* --- DASHBOARD --- */}
      {!path && userRole === "admin" && (
        <Dashboard
          isLoading={isLoading}
          statistic={statistic}
          // ✅ 3. Truyền props xuống Dashboard
          selectedYear={selectedYear}
          onChangeYear={setSelectedYear}
        />
      )}

      {/* --- QUẢN LÝ ĐƠN HÀNG --- */}
      {path === "orders" && userRole === "admin" && (
        <OrderManagement isLoading={isLoading} orders={allOrders} />
      )}

      {/* --- DANH SÁCH SẢN PHẨM --- */}
      {path === "products" &&
        (userRole === "admin" || userRole === "consultant") && (
          <Products
            isLoading={isLoading}
            products={products}
            setProducts={setProducts}
          />
        )}

      {/* --- THÊM SẢN PHẨM --- */}
      {path === "new-product" &&
        (userRole === "admin" || userRole === "consultant") && <ProductForm />}

      {/* --- SỬA SẢN PHẨM --- */}
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

      {/* --- LIVE CHAT --- */}
      {(path === "suggestion" || path.includes("live-chat")) &&
        (userRole === "admin" || userRole === "consultant") && (
          <SuggestionCheck />
        )}

      {/* --- BÁO CÁO DOANH THU THEO LOẠI --- */}
      {path === "category-stats" && userRole === "admin" && <CategoryStats />}

      {/* --- QUẢN LÝ USER --- */}
      {path === "users" && userRole === "admin" && <UserManagement />}

      {/* --- QUẢN LÝ TAGS --- */}
      {path === "tags" && userRole === "admin" && <TagsPage />}
    </div>
  );
};

export default InfoBoard;