import React, { useEffect } from "react";

//React-router-dom
import { Outlet, useLocation, useSubmit } from "react-router-dom";

//Import react-redux hooks
import { useDispatch } from "react-redux";

//Axios
import axios from "axios";

//Import auth actions
import { authActions } from "../store/auth";

//Utilfuncs
import { getAuthToken, getTokenDuration } from "../utils/auth";

const Root = () => {
  //isAuthenticated ,userName

  //submit
  const submit = useSubmit();

  //location object
  const location = useLocation();

  //dispatch
  const dispatch = useDispatch();

  //Handle navigation page
  useEffect(() => {
    //Get userName from localStorage
    const userName = localStorage.getItem("userName");

    //Get userRole from localStorage
    const userRole = localStorage.getItem("userRole");

    //Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // token
    const token = getAuthToken();

    //If no token
    if (!token) {
      delete axios.defaults.headers.common["Authorization"];
      return;
    }
    //Token expired
    if (token === "TOKEN EXPIRED" || !userName) {
      submit(null, { action: "/logout", method: "post" });
      dispatch(authActions.onLogout());
      delete axios.defaults.headers.common["Authorization"];
      return;
    }
    //Token valid
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    //Dispatch setAuth action
    dispatch(authActions.setAuth({ userName, token, userRole }));

    //Get token duration
    const tokenDuration = getTokenDuration();

    //Auto logout when token expired
    let timeoutId = setTimeout(() => {
      delete axios.defaults.headers.common["Authorization"];
      submit(null, { action: "/logout", method: "post" });
      dispatch(authActions.onLogout());
    }, tokenDuration);

    //Clean up function
    return () => {
      //Clear timeout
      clearTimeout(timeoutId);
    };
  }, [location.pathname, dispatch, submit]);

  return (
    <div>
      <main>
        {/* Render nested routes  */}
        <Outlet />
      </main>
    </div>
  );
};

export default Root;
