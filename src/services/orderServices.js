//API Đơn hàng
import { ORDER_API } from "../api/api";

//Axios
import axios from "axios";

//React router dom
import { json } from "react-router-dom";

//Admin lấy dữ liệu đơn hàng cho dashboard
export const axiosGetOrdersAdminDashBoard = async (token) => {
  try {
    //Gửi request bằng Axios
    const response = await axios.get(`${ORDER_API}/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response) {
      throw json(
        {
          message: "Có lỗi xảy ra khi lấy dữ liệu đơn hàng dashboard của admin.",
        },
        { status: 500 }
      );
    }

    return response.data;
  } catch (error) {
    throw json({ message: error.message }, { status: error.status });
  }
};

//Admin lấy chi tiết đơn hàng
export const axiosGetOrderDetailAdmin = async (token, orderId) => {
  try {
    //Gửi request bằng Axios
    const response = await axios.get(`${ORDER_API}/admin/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response) {
      throw json(
        {
          message: "Có lỗi xảy ra khi lấy chi tiết đơn hàng của admin.",
        },
        { status: 500 }
      );
    }

    return response.data;
  } catch (error) {
    throw json({ message: error.message }, { status: error.status });
  }
};
