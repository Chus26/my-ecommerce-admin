// export default AdminHeader;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import styles from "./AdminHeader.module.css";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const AdminHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const userName = useSelector((state) => state.auth.userName);

  // Lấy tiêu đề trang (Bạn có thể làm cái này động bằng Redux sau)
  // Tạm thời hard-code
  const pageTitle = "Thống kê";

  const handleLogout = () => {
    dispatch(authActions.onLogout());
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("expiration");
    navigate("/login/admin");
  };

  return (
    <header className={styles.adminHeader}>
      <div className={styles.leftContent}>
        {/* Thêm tiêu đề trang cho chuyên nghiệp */}
        <h2 className={styles.pageTitle}>{pageTitle}</h2>
      </div>
      <div className={styles.userProfile}>
        <button
          className={styles.profileButton}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <FaUserCircle className={styles.userIcon} />
          <span className={styles.userName}>{userName || "Admin"}</span>
        </button>

        {showDropdown && (
          <div
            className={styles.dropdownBackdrop}
            onClick={() => setShowDropdown(false)}
          >
            <div
              className={styles.dropdownMenu}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={handleLogout} className={styles.dropdownItem}>
                <FaSignOutAlt /> Đăng xuất
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;