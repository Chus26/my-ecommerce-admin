import React from "react";

//CSS module
import classes from "./OrderDetailPage.module.css";

//Order services
import { axiosGetOrderDetailAdmin } from "../services/orderServices";

//Get auth token
import { getAuthToken } from "../utils/auth";

//React router dom
import { useLoaderData, Link } from "react-router-dom";

const OrderDetailPage = () => {
  //Data
  const { order } = useLoaderData();

  return (
    <div className={classes["order-detail"]}>
      {order && (
        <div className={classes["order-container"]}>
          <div className={classes["order-info"]}>
            <h1>Information Order</h1>
            <p>ID User: {order.userId._id}</p>
            <p>Full Name: {order.userId.fullName}</p>
            <p>Phone: {order.userId.phoneNumber}</p>
            <p>Address: {order.userId.address}</p>
            <p>
              Total:{" "}
              {new Intl.NumberFormat("vi-VN").format(Number(order.totalPrice) || 0)} đ
            </p>
          </div>
          <div className={classes.back}>
            <Link to="/?location=">Go back</Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID PRODUCT</th>
                <th>IMAGE</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>COUNT</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item._id}>
                  <td>{item.product.code || item.product.id}</td>
                  <td>
                    <img
                      src={item.product.img}      /* ✅ dùng trực tiếp URL Cloudinary */
                      alt={item.product.name}
                    />
                  </td>
                  <td>{item.product.name}</td>
                  <td>
                    {new Intl.NumberFormat("vi-VN").format(Number(item.product.price) || 0)} đ
                  </td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;

export const loader = async ({ request, params }) => {
  // OrderId
  const { orderId } = params;

  //Get token
  const token = getAuthToken();
  if (!token || token === "TOKEN EXPIRED") {
    return null;
  }
  //Get data
  const data = await axiosGetOrderDetailAdmin(token, orderId);
  if (data) {
    return data;
  }
  return null;
};
