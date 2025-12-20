// export default Sidebar;

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import classes from "./Sidebar.module.css";

// Import các icon của Font Awesome
import {
  FaChartPie,
  FaCube,
  FaPlusSquare,
  FaTags,
  FaUsersCog,
  FaHeadset,
  FaSignOutAlt,
  FaTimes, // Icon X
  FaBars, // Icon Bars
  FaShoppingCart,
  FaListAlt // 👈 THÊM IMPORT ICON NÀY
} from "react-icons/fa";

// Helper để lấy "location" từ URL query
const getActiveLocation = (search) => {
  const params = new URLSearchParams(search);
  return params.get("location") || ""; // "Thống kê" là ""
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Lấy location hiện tại để biết mục nào đang "active"
  const activeLocation = getActiveLocation(location.search);

  const handleNavigate = (loc) => {
    navigate(`/?location=${loc}`);
  };

  const logoutHandler = () => {
    dispatch(authActions.onLogout());
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("expiration");
    navigate("/login");
  };

  return (
    <>
      {/* Nút 3 gạch cho mobile */}
      <label htmlFor="toggle-input" className={classes.toggle}>
        <FaBars />
      </label>
      <input type="checkbox" id="toggle-input" className={classes.toggleInput} />

      {/* Sidebar */}
      <aside className={classes.sidebar}>
        {/* Header của Sidebar */}
        <div className={classes.sidebarHeader}>
          <h1 className={classes.logo}>Admin Page </h1>
          <label htmlFor="toggle-input" className={classes.closeButton}>
            <FaTimes />
          </label>
        </div>

        {/* Nội dung (Các menu và nút Logout) */}
        <div className={classes.sidebarContent}>
          {/* Menu chính */}
          <nav className={classes.navMenu}>
            {/* Nhóm 1: Tổng quan */}
            <h3 className={classes.navGroupTitle}>Tổng quan</h3>
            <ul>
              <li
                className={activeLocation === "" ? classes.active : ""}
                onClick={() => handleNavigate("")}
              >
                <FaChartPie />
                <span>Thống kê</span>
              </li>
              
              {/* 👇 THÊM NÚT NÀY VÀO ĐÂY 👇 */}
              <li
                className={activeLocation === "category-stats" ? classes.active : ""}
                onClick={() => handleNavigate("category-stats")}
              >
                <FaListAlt />
                <span>Báo cáo doanh thu</span>
              </li>
              {/* 👆 KẾT THÚC THÊM 👆 */}

            </ul>

            {/* Nhóm 2: Quản lý */}
            <h3 className={classes.navGroupTitle}>Quản lý</h3>
            <ul>
              <li
                className={activeLocation === "products" ? classes.active : ""}
                onClick={() => handleNavigate("products")}
              >
                <FaCube />
                <span>Sản phẩm</span>
              </li>
              <li
                className={
                  activeLocation === "new-product" ? classes.active : ""
                }
                onClick={() => handleNavigate("new-product")}
              >
                <FaPlusSquare />
                <span>Thêm sản phẩm mới</span>
              </li>
              <li
                className={activeLocation === "tags" ? classes.active : ""}
                onClick={() => handleNavigate("tags")}
              >
                <FaTags />
                <span>Quản lý Tag (AI)</span>
              </li>
              <li
                className={activeLocation === "users" ? classes.active : ""}
                onClick={() => handleNavigate("users")}
              >
                <FaUsersCog />
                <span>Quản lý Người dùng</span>
              </li>
              <li
                className={activeLocation === "orders" ? classes.active : ""}
                onClick={() => handleNavigate("orders")}
              >
                <FaShoppingCart />
                <span>Quản lý Đơn hàng</span>
              </li>
            </ul>

            {/* Nhóm 3: Công cụ */}
            <h3 className={classes.navGroupTitle}>Công cụ</h3>
            <ul>
              <li
                className={
                  activeLocation === "suggestion" ? classes.active : ""
                }
                onClick={() => handleNavigate("suggestion")}
              >
                <FaHeadset />
                <span> Giám Sát AI</span>
              </li>
            </ul>
          </nav>

          {/* Nút Đăng xuất (Luôn ở dưới cùng) */}
          <div className={classes.navFooter}>
            <button onClick={logoutHandler} className={classes.logoutButton}>
              <FaSignOutAlt />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;