const API_URL = (process.env.REACT_APP_BACKEND_API || process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");
const makeUrl = (path) => (API_URL ? `${API_URL}${path}` : path);

const handleResponse = async (response) => {
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    if (response.status === 422 && errData.errors) {
      const firstError = errData.errors[0];
      throw new Error(`Lỗi ${firstError.path || "đầu vào"}: ${firstError.msg}`);
    }
    throw new Error(errData.message || `Lỗi ${response.status}`);
  }
  return response.json();
};

export const axiosGetAllUsers = async (token) => {
  const response = await fetch(makeUrl(`/api/auth/users`), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const axiosAddUser = async (token, userData) => {
  const response = await fetch(makeUrl(`/api/auth/users`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const axiosUpdateUser = async (token, userId, userData) => {
  const response = await fetch(makeUrl(`/api/auth/users/${userId}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const axiosDeleteUser = async (token, userId) => {
  const response = await fetch(makeUrl(`/api/auth/users/${userId}`), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};
