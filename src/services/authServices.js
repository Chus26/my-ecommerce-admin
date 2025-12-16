// //Auth API
// import { AUTH_API } from "../api/api";

// //Import axios
// import axios from "axios";

// //Login / Signup API
// export const axiosAuthRequest = async (pathname, dataSend) => {
//   try {
//     //Axios call auth request
//     const response = await axios.post(
//       `${AUTH_API}/${pathname}/admin`,
//       dataSend
//     );
//     //No response => exit logic
//     if (!response && response?.status !== 422) {
//       return;
//     }

//     if (response?.status === 201) {
//       return response.data;
//     }
//   } catch (error) {
//     //Get validation errors data
//     if (error?.response?.status === 422 || error?.response?.status === 403) {
//       return error.response.data;
//     } else {
//       //other errors
//       console.log(error);
//     }
//   }
// };

//API Xác thực
import { AUTH_API } from "../api/api";

//Import axios
import axios from "axios";

//API Đăng nhập / Đăng ký
export const axiosAuthRequest = async (pathname, dataSend) => {
  try {
    //Gọi axios request xác thực
    const response = await axios.post(
      `${AUTH_API}/${pathname}/admin`,
      dataSend
    );
    //Không có phản hồi => thoát logic
    if (!response && response?.status !== 422) {
      return;
    }

    //Trạng thái thành công
    if (response?.status === 201) {
      return response.data;
    }
  } catch (error) {
    //Lấy dữ liệu lỗi validation
    if (error?.response?.status === 422 || error?.response?.status === 403) {
      return error.response.data;
    } else {
      //Các lỗi khác
      console.log(error);
    }
  }
};
