// ===== FILE: src/services/suggestionServices.js (Tạo mới) =====

import axios from 'axios';
import { getAuthToken } from '../utils/auth'; // Đảm bảo đường dẫn đúng

const API_URL = (process.env.REACT_APP_BACKEND_API || process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");
const makeUrl = (path) => (API_URL ? `${API_URL}${path}` : path);

// Lấy các gợi ý đang chờ duyệt
export const axiosGetSuggestionsForReview = async () => {
  const token = getAuthToken();
  if (!token || token === "TOKEN EXPIRED") throw new Error("No token");
  
  // URL API mới
  const response = await axios.get(makeUrl('/api/suggestions'), { 
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data; // { suggestions: [...] }
};

// Gửi đánh giá (Duyệt/Từ chối)
export const axiosReviewSuggestion = async (id, status, note) => {
    const token = getAuthToken();
    if (!token || token === "TOKEN EXPIRED") throw new Error("No token");

    // URL API mới
    const response = await axios.patch(makeUrl(`/api/suggestions/${id}/review`), 
      { status, note },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data; // { message, suggestion }
};