import React, { useState, useEffect } from "react";

//CSS module
import classes from "./AuthForm.module.css";

//React-redux hooks
import { useDispatch } from "react-redux";

//Auth actions
import { authActions } from "../store/auth";

//Auth Service
import { axiosAuthRequest } from "../services/authServices";

//React-router-dom
import { useNavigate, Form, useActionData } from "react-router-dom";

const AuthForm = ({ login }) => {
  //Điều hướng
  const navigate = useNavigate();

  //Dispatch
  const dispatch = useDispatch();

  //Lấy dữ liệu phản hồi từ API
  const data = useActionData();

  //Lỗi Email
  const emailErrors = data?.errors?.filter((error) => error.path === "email");

  //Lỗi Họ tên
  const fullNameErrors = data?.errors?.filter(
    (error) => error.path === "fullName"
  );

  //Lỗi Mật khẩu
  const passwordErrors = data?.errors?.filter(
    (error) => error.path === "password"
  );

  //Lỗi Số điện thoại
  const phoneNumberErrors = data?.errors?.filter(
    (error) => error.path === "phoneNumber"
  );

  useEffect(() => {
    //Khi xác thực thành công
    if (data?.token && data?.userName) {
      //Lưu token vào localStorage
      localStorage.setItem("token", data?.token);
      //Tạo thời gian hết hạn
      const expiration = new Date();
      //Lưu thời gian hết hạn vào localStorage
      expiration.setHours(expiration.getHours() + 3);
      localStorage.setItem("expiration", expiration);
      //Lưu userName và userRole vào localStorage
      localStorage.setItem("userName", data?.userName);
      localStorage.setItem("userRole", data?.userRole);

      //Dispatch để set Auth
      dispatch(
        authActions.setAuth({
          token: data?.token,
          userName: data?.userName,
          userRole: data?.userRole,
        })
      );

      return navigate("/");
    }
  }, [data?.token, data?.userName, data?.userRole, dispatch, navigate]);

  //Trạng thái dữ liệu xác thực
  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  //Hàm xử lý thay đổi input
  const inputChangeHandler = (e) => {
    //Cập nhật state khi thay đổi input
    setAuthData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  return (
    <div className={classes.auth}>
      <div className={classes.container}>
        <Form
          method="post"
          action={login ? "/login" : "/signup"}
          className={classes["auth-form"]}
          noValidate
        >
          <div className={classes["form-group"]}>
            <h1>{login ? "Đăng nhập" : "Đăng ký"}</h1>
            {data?.errors?.length > 0 && (
              <div className={classes["error-container"]}>
                {fullNameErrors?.length > 0 && <p>{fullNameErrors[0].msg}</p>}
                {emailErrors?.length > 0 && <p>{emailErrors[0].msg}</p>}
                {phoneNumberErrors?.length > 0 && (
                  <p>{phoneNumberErrors[0].msg}</p>
                )}
                {passwordErrors?.length > 0 && <p>{passwordErrors[0].msg}</p>}
              </div>
            )}

            <>
              <input
                value={authData.email}
                onChange={inputChangeHandler}
                type="email"
                name="email"
                placeholder="Email"
              />
              <input
                value={authData.password}
                onChange={inputChangeHandler}
                type="password"
                name="password"
                placeholder="Mật khẩu"
              />
            </>
          </div>
          <button type="Submit">{login ? "Đăng nhập" : "Đăng ký"}</button>
        </Form>
      </div>
    </div>
  );
};

export default AuthForm;

export const action = async ({ request, params }) => {
  //Lấy dữ liệu từ Form
  const data = await request.formData();
  //Xác định đường dẫn
  const pathname = window.location.href.includes("/login") ? "login" : "signup";
  //Dữ liệu gửi đi
  const dataSend = {
    fullName: data.get("name") ? data.get("name") : undefined,
    email: data.get("email"),
    phoneNumber: data.get("phone") ? data.get("phone") : undefined,
    password: data.get("password"),
  };
  //Gọi request xác thực
  const responseData = await axiosAuthRequest(pathname, dataSend);
  //Khi vai trò không được chấp nhận
  if (responseData?.message) {
    alert(`${responseData.message}`);
    return null;
  }

  if (responseData) {
    return responseData;
  }

  //Trường hợp khác
  return null;
};
