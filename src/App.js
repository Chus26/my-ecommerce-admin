// //Import from react-router-dom
// import { createBrowserRouter, RouterProvider } from "react-router-dom";

// //Import components
// import Root from "./pages/Root";
// import ErrorPage from "./pages/ErrorPage";

// import LoginPage from "./pages/LoginPage";
// import { action as authAction } from "./components/AuthForm";
// import { action as logoutAction } from "./pages/Logout";
// import ProtectedAuthRoute from "./components/ProtectedAuthRoute";
// import ProtectedRoutes from "./components/ProtectedRoutes";
// import IndexPage from "./pages/IndexPage";
// import OrderDetailPage, {
//   loader as orderDetailLoader,
// } from "./pages/OrderDetailPage";

// //Defines  routes via  createBrowerRouter func
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <ProtectedRoutes>
//         <Root />
//       </ProtectedRoutes>
//     ),
//     errorElement: <ErrorPage />,

//     children: [
//       {
//         index: true,
//         element: <IndexPage />,
//       },

//       {
//         path: "/logout",
//         element: null,
//         action: logoutAction,
//       },
//       {
//         path: ":orderId",
//         element: <OrderDetailPage />,
//         loader: orderDetailLoader,
//       },
//     ],
//   },
//   {
//     path: "login",
//     element: (
//       <ProtectedAuthRoute>
//         <LoginPage />
//       </ProtectedAuthRoute>
//     ),
//     action: authAction,
//   },
// ]);

// function App() {
//   //Render Router Component Tree
//   return <RouterProvider router={router} />;
// }

// export default App;

// ===== FILE: src/App.js (ĐÃ LÀM SẠCH) =====

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "./store/auth";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./pages/Root";
import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/LoginPage";
import { action as authAction } from "./components/AuthForm";
import { action as logoutAction } from "./pages/Logout";
import ProtectedAuthRoute from "./components/ProtectedAuthRoute";
import ProtectedRoutes from "./components/ProtectedRoutes";
import IndexPage from "./pages/IndexPage";
import OrderDetailPage, { loader as orderDetailLoader } from "./pages/OrderDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <Root />
      </ProtectedRoutes>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <IndexPage /> },
      { path: "/logout", element: null, action: logoutAction },
      { path: ":orderId", element: <OrderDetailPage />, loader: orderDetailLoader },
    ],
  },
  {
    path: "login",
    element: (
      <ProtectedAuthRoute>
        <LoginPage />
      </ProtectedAuthRoute>
    ),
    action: authAction,
  },
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");
    const expirationTime = localStorage.getItem("expiration");

    if (token && userName && expirationTime) {
      const remainingTime = new Date(expirationTime).getTime() - new Date().getTime();

      if (remainingTime > 0) {
        dispatch(
          authActions.setAuth({
            token,
            userName,
            userRole: userRole || "user",
          })
        );
      } else {
        dispatch(authActions.onLogout());
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        localStorage.removeItem("expiration");
      }
    }
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
