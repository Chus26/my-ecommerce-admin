// export default UserManagement;

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import classes from "./SuggestionCheck.module.css"; // Dùng chung CSS
import {
  axiosGetAllUsers,
  axiosAddUser,
  axiosUpdateUser,
  axiosDeleteUser,
} from "../services/userServices";
import Pagination from "./Pagination"; // <-- ĐÃ IMPORT

// (Component UserFormModal giữ nguyên)
const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  userData,
  mode,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "user",
    password: "",
  });

  useEffect(() => {
    if (mode === "edit" && userData) {
      setFormData({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        role: userData.role || "user",
        password: "",
      });
    } else {
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        role: "user",
        password: "",
      });
    }
  }, [isOpen, mode, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    if (mode === "edit" && !dataToSubmit.password) {
      delete dataToSubmit.password;
    }
    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  return (
    <div className={classes.modalBackdrop}>
      <div className={classes.modalContent}>
        <h2>
          {mode === "add" ? "Thêm Người Dùng Mới" : "Cập Nhật Người Dùng"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* ... (Toàn bộ code form giữ nguyên) ... */}
          <div className={classes.formGroup}>
            <label>Họ và Tên:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              minLength="5"
            />
          </div>
          <div className={classes.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={classes.formGroup}>
            <label>Số điện thoại:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className={classes.formGroup}>
            <label>Vai trò (Role):</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="consultant">Consultant</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className={classes.formGroup}>
            <label>
              {mode === "add"
                ? "Mật khẩu:"
                : "Mật khẩu mới (để trống nếu không đổi):"}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={
                mode === "add"
                  ? "Ít nhất 6 ký tự"
                  : "Để trống nếu không đổi"
              }
              autoComplete="new-password"
            />
          </div>
          <div className={classes.modalActions}>
            <button type="button" onClick={onClose} disabled={isLoading}>
              Hủy
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// === COMPONENT CHÍNH ĐÃ CẬP NHẬT ===

const ITEMS_PER_PAGE = 8; // Số lượng user mỗi trang

const UserManagement = () => {
  const { token, userId: adminUserId } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);

  // State cho tìm kiếm và phân trang
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // (Hàm fetchUsers giữ nguyên)
  const fetchUsers = useCallback(async () => {
    if (!token || token === "TOKEN EXPIRED") {
      setError("Vui lòng đăng nhập lại.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await axiosGetAllUsers(token);
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // (Các hàm handle modal giữ nguyên)
  const handleOpenAddModal = () => {
    setSelectedUser(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleFormSubmit = async (formData) => {
    setUpdatingId(selectedUser?._id || "new");
    try {
      if (modalMode === "add") {
        const { user: newUser } = await axiosAddUser(token, formData);
        setUsers((prev) => [newUser, ...prev]);
        alert("Thêm người dùng thành công!");
      } else if (modalMode === "edit" && selectedUser) {
        const { user: updatedUser } = await axiosUpdateUser(
          token,
          selectedUser._id,
          formData
        );
        setUsers((prev) =>
          prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
        );
        alert("Cập nhật thành công!");
      }
      handleCloseModal();
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (userId === adminUserId) {
      alert("Bạn không thể tự xóa chính mình.");
      return;
    }
    if (!window.confirm(`Bạn có chắc chắn muốn xóa "${userName}" không?`)) {
      return;
    }
    setUpdatingId(userId);
    try {
      await axiosDeleteUser(token, userId);
      alert("Xóa người dùng thành công!");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert(`Lỗi khi xóa: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Logic Lọc và Phân trang
  const filteredUsers = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase().trim();
    if (!lowerCaseSearch) {
      return users;
    }
    return users.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(lowerCaseSearch) ||
        user.email?.toLowerCase().includes(lowerCaseSearch) ||
        user.phoneNumber?.toLowerCase().includes(lowerCaseSearch)
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className={classes.suggestionContainer}>
      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        userData={selectedUser}
        mode={modalMode}
        isLoading={!!updatingId}
      />
      <h4 className={classes.title}>Quản lý Người dùng</h4>
      <p className={classes.breadcrumb}>Ứng dụng / Người dùng</p>
      
      {/* Ô tìm kiếm đã được kích hoạt */}
      <div className={classes.controls}>
        <input
          type="text"
          placeholder="Tìm kiếm (Tên, Email, SĐT)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleOpenAddModal}
          style={{ backgroundColor: "#28a745" }}
        >
          + Thêm Người Dùng
        </button>
      </div>
      
      {isLoading && (
        <p className={classes.loadingText}>Đang tải danh sách người dùng...</p>
      )}
      {error && <p className={classes.errorText}>Lỗi: {error}</p>}
      
      {!isLoading && !error && (
        <div className={classes.tableContainer}>
          <table
            className={classes.suggestionTable}
            style={{ minWidth: "800px" }}
          >
            <thead>
              <tr>
                <th className={classes.colUser}>Họ và Tên</th>
                <th className={classes.colMainProduct}>Email</th>
                <th className={classes.colAdvice}>Số điện thoại</th>
                <th style={{ width: "100px" }}>Vai trò</th>
                <th className={classes.colActions}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {/* Cập nhật logic "Không tìm thấy" */}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    {searchTerm
                      ? "Không tìm thấy người dùng phù hợp."
                      : "Không có người dùng nào."}
                  </td>
                </tr>
              )}
              
              {/* Map qua paginatedUsers */}
              {paginatedUsers.map((user) => (
                <tr
                  key={user._id}
                  style={{ opacity: updatingId === user._id ? 0.5 : 1 }}
                >
                  <td className={classes.colUser}>{user.fullName}</td>
                  <td className={classes.colMainProduct}>{user.email}</td>
                  <td className={classes.colAdvice}>{user.phoneNumber}</td>
                  <td style={{ textTransform: "capitalize" }}>
                    {user.role}
                    {user._id === adminUserId && " (Bạn)"}
                  </td>
                  <td className={classes.colActions}>
                    <div className={classes.actionButtons}>
                      <button
                        className={classes.actionButton}
                        style={{ backgroundColor: "#007bff" }}
                        onClick={() => handleOpenEditModal(user)}
                        disabled={user._id === adminUserId || !!updatingId}
                      >
                        Sửa
                      </button>
                      <button
                        className={classes.actionButton}
                        style={{ backgroundColor: "#dc3545" }}
                        onClick={() =>
                          handleDeleteUser(user._id, user.fullName)
                        }
                        disabled={user._id === adminUserId || !!updatingId}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* KHỐI PHÂN TRANG */}
      {!isLoading && !error && totalPages > 1 && (
        <div className={classes.paginationContainer}>
          <p className={classes.totalCount}>
            Hiển thị {paginatedUsers.length} trên tổng số{" "}
            {filteredUsers.length} người dùng
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            classes={classes}
          />
        </div>
      )}
    </div>
  );
};

export default UserManagement;