// ===== FILE: src/services/tagServices.js (CẬP NHẬT) =====

import { getAuthToken } from "../utils/auth";
const API_BASE = (process.env.REACT_APP_BACKEND_API || "").replace(/\/+$/, "");
const makeUrl = (p) => (API_BASE ? `${API_BASE}${p}` : p);

/**
 * Lấy TẤT CẢ tag trong thư viện về (Giữ nguyên)
 */
export async function apiGetAllTags() {
  const token = getAuthToken();
  if (!token || token === "TOKEN EXPIRED") return { tags: [] };

  try {
    const res = await fetch(makeUrl(`/api/tags`), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { tags: [] };
    return res.json(); // Trả về { tags: [...] }
  } catch (error) {
    console.error("Failed to fetch all tags:", error);
    return { tags: [] };
  }
}

// ===================================
// === THÊM 3 HÀM MỚI NÀY VÀO ĐÂY ===
// ===================================

/**
 * Admin tạo 1 tag mới
 * @param {object} tagData - (VD: { name: "iPhone 17", slug: "product_iphone_17", type: "product_model" })
 */
export async function apiCreateTag(tagData) {
  const token = getAuthToken();
  try {
    const res = await fetch(makeUrl(`/api/tags`), {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tagData),
    });
    return res.json(); // Trả về { message, tag } hoặc { message }
  } catch (error) {
    return { message: error.message || "Lỗi kết nối" };
  }
}

/**
 * Admin cập nhật 1 tag
 * @param {string} tagId 
 * @param {object} tagData 
 */
export async function apiUpdateTag(tagId, tagData) {
  const token = getAuthToken();
  try {
    const res = await fetch(makeUrl(`/api/tags/${tagId}`), {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tagData),
    });
    return res.json();
  } catch (error) {
     return { message: error.message || "Lỗi kết nối" };
  }
}

/**
 * Admin xóa 1 tag
 * @param {string} tagId 
 */
export async function apiDeleteTag(tagId) {
  const token = getAuthToken();
  try {
    const res = await fetch(makeUrl(`/api/tags/${tagId}`), {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json(); // Trả về { message, tagId }
  } catch (error) {
    return { message: error.message || "Lỗi kết nối" };
  }
}