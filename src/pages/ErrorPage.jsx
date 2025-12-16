import React from "react";

//Import from react-router-dom
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  //Get data error
  const data = useRouteError();

  //Default  error title
  let title = "Something went wrong!";

  //Set data error
  if (data) {
    title = data?.error?.message;
  }

  return <div>{title}</div>;
};

export default ErrorPage;
