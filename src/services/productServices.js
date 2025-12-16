// //Product API
// import { PRODUCT_API } from "../api/api";
// //Axios
// import axios from "axios";
// //React router dom
// import { json, Navigate } from "react-router-dom";

// //Get all products hompage
// export const axiosGetProducts = async () => {
//   try {
//     //Axios Fetch Request
//     const response = await axios.get(`${PRODUCT_API}`);

//     if (!response) {
//       throw json(
//         { message: "Something went wrong when getting products" },
//         { status: 500 }
//       );
//     }

//     return response.data.products;
//   } catch (error) {
//     throw json({ message: error.message }, { status: error.status });
//   }
// };

// //Get product edit page admin
// export const axiosGetProductEdit = async (token, productId) => {
//   try {
//     //Axios Fetch Request
//     const response = await axios.get(`${PRODUCT_API}/admin/${productId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response) {
//       throw json(
//         {
//           message: "Something went wrong when getting product edit admin page",
//         },
//         { status: 500 }
//       );
//     }

//     return response.data.product;
//   } catch (error) {
//     throw json({ message: error.message }, { status: error.status });
//   }
// };

// //Admin post create a new product
// export const axiosPostCreateProductAdmin = async (token, dataSend) => {
//   try {
//     //Axios Fetch Request
//     const response = await axios.post(
//       `${PRODUCT_API}/admin/new-product`,
//       dataSend,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data;",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     //No response => exit logic
//     if (!response && response?.status !== 422) {
//       return;
//     }

//     if (response.status === 201) {
//       return response.data;
//     }
//   } catch (error) {
//     //Get validation errors data
//     if (error?.response?.status === 422) {
//       return error.response.data;
//     } else {
//       //other errors
//       console.log(error);
//     }
//   }
// };
// //Admin patch edit a  product
// export const axiosPatchEditProductAdmin = async (
//   token,
//   dataSend,
//   productId
// ) => {
//   try {
//     //Axios Fetch Request
//     const response = await axios.patch(
//       `${PRODUCT_API}/admin/edit-product/${productId}`,
//       dataSend,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     //No response => exit logic
//     if (!response && response?.status !== 422) {
//       return;
//     }

//     if (response.status === 201) {
//       return response.data;
//     }
//   } catch (error) {
//     //Get validation errors data
//     if (error?.response?.status === 422) {
//       return error.response.data;
//     } else {
//       //other errors
//       console.log(error);
//     }
//   }
// };

// //Delete admin product
// export const axiosDeleteProductAdmin = async (token, productId) => {
//   try {
//     //Axios Fetch Request
//     const response = await axios.delete(`${PRODUCT_API}/admin/${productId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response) {
//       throw json(
//         {
//           message: "Something went wrong when getting product edit admin page",
//         },
//         { status: 500 }
//       );
//     }
//     //When success
//     return response.data;
//   } catch (error) {
//     throw json({ message: error.message }, { status: error.status });
//   }
// };

// //API Sản phẩm
// import { PRODUCT_API } from "../api/api";
// //Axios
// import axios from "axios";
// //React router dom
// import { json } from "react-router-dom";

// //Lấy tất cả sản phẩm ở trang chủ
// export const axiosGetProducts = async () => {
//   try {
//     //Gửi request bằng Axios
//     const response = await axios.get(`${PRODUCT_API}`);

//     if (!response) {
//       throw json(
//         { message: "Có lỗi xảy ra khi lấy danh sách sản phẩm" },
//         { status: 500 }
//       );
//     }

//     return response.data.products;
//   } catch (error) {
//     throw json({ message: error.message }, { status: error.status });
//   }
// };

// //Admin lấy sản phẩm để chỉnh sửa
// export const axiosGetProductEdit = async (token, productId) => {
//   try {
//     //Gửi request bằng Axios
//     const response = await axios.get(`${PRODUCT_API}/admin/${productId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response) {
//       throw json(
//         {
//           message: "Có lỗi xảy ra khi lấy dữ liệu sản phẩm cho trang chỉnh sửa admin",
//         },
//         { status: 500 }
//       );
//     }

//     return response.data.product;
//   } catch (error) {
//     throw json({ message: error.message }, { status: error.status });
//   }
// };

// //Admin tạo mới sản phẩm
// export const axiosPostCreateProductAdmin = async (token, dataSend) => {
//   try {
//     //Gửi request bằng Axios
//     const response = await axios.post(
//       `${PRODUCT_API}/admin/new-product`,
//       dataSend,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data;",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     //Không có phản hồi => thoát logic
//     if (!response && response?.status !== 422) {
//       return;
//     }

//     if (response.status === 201) {
//       return response.data;
//     }
//   } catch (error) {
//     //Lấy dữ liệu lỗi validation
//     if (error?.response?.status === 422) {
//       return error.response.data;
//     } else {
//       //Các lỗi khác
//       console.log(error);
//     }
//   }
// };

// //Admin chỉnh sửa sản phẩm
// export const axiosPatchEditProductAdmin = async (
//   token,
//   dataSend,
//   productId
// ) => {
//   try {
//     //Gửi request bằng Axios
//     const response = await axios.patch(
//       `${PRODUCT_API}/admin/edit-product/${productId}`,
//       dataSend,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     //Không có phản hồi => thoát logic
//     if (!response && response?.status !== 422) {
//       return;
//     }

//     if (response.status === 201) {
//       return response.data;
//     }
//   } catch (error) {
//     //Lấy dữ liệu lỗi validation
//     if (error?.response?.status === 422) {
//       return error.response.data;
//     } else {
//       //Các lỗi khác
//       console.log(error);
//     }
//   }
// };

// //Admin xoá sản phẩm
// export const axiosDeleteProductAdmin = async (token, productId) => {
//   try {
//     //Gửi request bằng Axios
//     const response = await axios.delete(`${PRODUCT_API}/admin/${productId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response) {
//       throw json(
//         {
//           message: "Có lỗi xảy ra khi xoá sản phẩm trong trang admin",
//         },
//         { status: 500 }
//       );
//     }
//     //Khi thành công
//     return response.data;
//   } catch (error) {
//     throw json({ message: error.message }, { status: error.status });
//   }
// };

// productServices.js
import { PRODUCT_API } from "../api/api";
import axios from "axios";
import { json } from "react-router-dom";

// Lấy tất cả sản phẩm (giữ nguyên)
export const axiosGetProducts = async () => {
  try {
    const response = await axios.get(`${PRODUCT_API}`);
    if (!response) {
      throw json({ message: "Có lỗi xảy ra khi lấy danh sách sản phẩm" }, { status: 500 });
    }
    return response.data.products;
  } catch (error) {
    throw json({ message: error.message }, { status: error.status });
  }
};

// Lấy sản phẩm để chỉnh sửa (giữ nguyên)
export const axiosGetProductEdit = async (token, productId) => {
  try {
    const response = await axios.get(`${PRODUCT_API}/admin/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response) {
      throw json({ message: "Có lỗi xảy ra khi lấy dữ liệu sản phẩm cho trang chỉnh sửa admin" }, { status: 500 });
    }
    return response.data.product;
  } catch (error) {
    throw json({ message: error.message }, { status: error.status });
  }
};

// ✅ Tạo mới sản phẩm — để Axios tự set Content-Type (FormData) + throw lỗi 409
export const axiosPostCreateProductAdmin = async (token, dataSend) => {
  try {
    const response = await axios.post(
      `${PRODUCT_API}/admin/new-product`,
      dataSend,
      {
        headers: {
          // KHÔNG set 'Content-Type' cho FormData để Axios tự gắn boundary
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    const { response } = err || {};
    if (response?.status === 422) {
      // trả về errors validation cho ErrorModal
      return response.data;
    }
    if (response) {
      // ném lỗi (bao gồm 409) để Form bắt và alert
      throw err;
    }
    throw new Error("Network error");
  }
};

// ✅ Chỉnh sửa sản phẩm — gửi FormData, KHÔNG dùng 'application/json' + throw lỗi 409
// export const axiosPatchEditProductAdmin = async (token, dataSend, productId) => {
//   try {
//     const response = await axios.patch(
//       `${PRODUCT_API}/admin/edit-product/${productId}`,
//       dataSend,
//       {
//         headers: {
//           // KHÔNG set 'Content-Type' cho FormData
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (err) {
//     const { response } = err || {};
//     if (response?.status === 422) {
//       return response.data;
//     }
//     if (response) {
//       // ném lỗi (bao gồm 409) để Form bắt và alert
//       throw err;
//     }
//     throw new Error("Network error");
//   }
// };
// Admin chỉnh sửa sản phẩm
// export const axiosPatchEditProductAdmin = async (token, dataSend, productId) => {
//   try {
//     const response = await axios.patch(
//       `${PRODUCT_API}/admin/edit-product/${productId}`,
//       dataSend, // <-- dataSend là object JSON, KHÔNG phải FormData
//       {
//         headers: {
//           "Content-Type": "application/json", // đúng cho JSON
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response && response?.status !== 422) return;

//     if (response.status === 201) {
//       return response.data;
//     }
//   } catch (error) {
//     if (error?.response?.status === 422) {
//       return error.response.data; // để ErrorModal hiển thị lỗi validate
//     }
//     throw error; // để bắt 409 ở ngoài (trùng mã) hiển thị alert
//   }
// };
// src/services/productServices.js
export const axiosPatchEditProductAdmin = async (token, dataSend, productId) => {
  try {
    const isFormData = (typeof FormData !== "undefined") && (dataSend instanceof FormData);
    const response = await axios.patch(
      `${PRODUCT_API}/admin/edit-product/${productId}`,
      dataSend,
      {
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error?.response?.status === 422) return error.response.data;
    throw error;
  }
};



// Xoá sản phẩm (giữ nguyên)
export const axiosDeleteProductAdmin = async (token, productId) => {
  try {
    const response = await axios.delete(`${PRODUCT_API}/admin/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response) {
      throw json({ message: "Có lỗi xảy ra khi xoá sản phẩm trong trang admin" }, { status: 500 });
    }
    return response.data;
  } catch (error) {
    throw json({ message: error.message }, { status: error.status });
  }
};
