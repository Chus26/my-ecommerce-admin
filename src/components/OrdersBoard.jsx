import React from "react";
import classes from "./OrdersBoard.module.css";

const OrdersBoard = ({ statistic }) => {
  const fmtVND = (v) =>
    new Intl.NumberFormat("vi-VN").format(Number(v) || 0) + " đ";

  return (
    <div className={classes["orders-boards"]}>
      <div>
        <div className={classes.left}>
          <h3>{statistic.users}</h3>
          <p>Khách hàng</p>
        </div>
        <div className={classes.right}>
          <i className="fa-solid fa-user-plus"></i>
        </div>
      </div>

      <div>
        <div className={classes.left}>
          <h3 className={classes.money}>{fmtVND(statistic.earningsOfMonth)}</h3>
          <p>Doanh thu trong tháng</p>
        </div>
        <div className={classes.right}>
          <i className="fa-solid fa-dollar-sign"></i>
        </div>
      </div>

      {/* <div>
        <div className={classes.left}>
          <h3 className={classes.money}>{fmtVND(statistic.averageOfMonths)}</h3>
          <p>Trung bình các tháng</p>
        </div>
        <div className={classes.right}>
          <i className="fa-solid fa-dollar-sign"></i>
        </div>
      </div> */}

      <div>
        <div className={classes.left}>
          <h3 className={classes.money}>{fmtVND(statistic.totalEarnings)}</h3>
          <p>Tổng doanh thu</p>
        </div>
        <div className={classes.right}>
          <i className="fa-solid fa-dollar-sign"></i>
        </div>
      </div>

      <div>
        <div className={classes.left}>
          <h3>{`${statistic.successfulOrders ?? 0} / ${statistic.orders ?? 0}`}</h3>
          <p>Đơn thành công</p>
        </div>
        <div className={classes.right}>
          <i className="fa-solid fa-check-double"></i>
        </div>
      </div>
    </div>
  );
};

export default OrdersBoard;
