import { redirect } from "react-router-dom";

export const action = () => {
  //Remove token, userName expiration time from local Storage
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  localStorage.removeItem("userName");
  return redirect("/login");
};
