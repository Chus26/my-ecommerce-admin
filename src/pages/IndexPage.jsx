// import React from "react";
// import classes from "./IndexPage.module.css";
// import Sidebar from "../components/Sidebar";
// import InfoBoard from "../components/InfoBoard";
// import AdminHeader from "../components/AdminHeader";
// import { getAuthToken } from "../utils/auth";

// const IndexPage = () => {
//   const token = getAuthToken();

//   return (
//     <>
//       {token && token !== "TOKEN EXPIRED" && (
//         <div className={classes.adminLayout}>
//           {/* Sidebar được đặt ở đây, nó sẽ fixed */}
//           <Sidebar />

//           {/* mainContent sẽ chứa Header và nội dung trang */}
//           <main className={classes.mainContent}>
//             <AdminHeader />
//             <div className={classes.pageContent}>
//               {/* Nội dung trang của bạn (Dashboard) */}
//               <InfoBoard />
//             </div>
//           </main>
//         </div>
//       )}
//     </>
//   );
// };

// export default IndexPage;

// import React from "react";
// import { useSearchParams } from "react-router-dom"; // 1. Import hook đọc URL

// import classes from "./IndexPage.module.css";
// import Sidebar from "../components/Sidebar";
// import InfoBoard from "../components/InfoBoard";
// import AdminHeader from "../components/AdminHeader";
// import { getAuthToken } from "../utils/auth";

// // 2. Import Component Thống kê mới
// import CategoryStats from "../components/CategoryStats";

// // (Nếu bạn có các file component khác như Product, NewProduct... thì import vào đây)
// // import Product from "../components/Product";

// const IndexPage = () => {
//   const token = getAuthToken();

//   // 3. Lấy giá trị "location" từ URL
//   const [searchParams] = useSearchParams();
//   const location = searchParams.get("location");

//   // 4. Quyết định hiển thị nội dung nào dựa trên location
//   let content;

//   switch (location) {
//     case "category-stats":
//       content = <CategoryStats />; // Hiển thị trang có nút Excel
//       break;

//     // Các case khác (bạn bỏ comment và import component tương ứng nếu có)
//     // case "products":
//     //   content = <Product />;
//     //   break;
//     // case "new-product":
//     //   content = <NewProduct />;
//     //   break;
//     // case "users":
//     //   content = <Users />;
//     //   break;

//     default:
//       content = <InfoBoard />; // Mặc định hiện Dashboard thống kê chung
//       break;
//   }

//   return (
//     <>
//       {token && token !== "TOKEN EXPIRED" && (
//         <div className={classes.adminLayout}>
//           {/* Sidebar được đặt ở đây, nó sẽ fixed */}
//           <Sidebar />

//           {/* mainContent sẽ chứa Header và nội dung trang */}
//           <main className={classes.mainContent}>
//             <AdminHeader />
//             <div className={classes.pageContent}>
//               {/* 5. Thay thế InfoBoard cố định bằng biến content động */}
//               {content}
//             </div>
//           </main>
//         </div>
//       )}
//     </>
//   );
// };

// export default IndexPage;

// src/pages/IndexPage.jsx
import React, { useState } from "react";
import classes from "./IndexPage.module.css";
import Sidebar from "../components/Sidebar";
import InfoBoard from "../components/InfoBoard";
import AdminHeader from "../components/AdminHeader";
import { getAuthToken } from "../utils/auth";

const IndexPage = () => {
  const token = getAuthToken();

  // 1. Tạo State quản lý việc đóng/mở Sidebar tại đây
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebarHandler = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <>
      {token && token !== "TOKEN EXPIRED" && (
        <div className={classes.adminLayout}>
          
          {/* 2. Truyền props xuống Sidebar để nó biết khi nào cần thu nhỏ */}
          <Sidebar 
            isCollapsed={isSidebarCollapsed} 
            onToggle={toggleSidebarHandler} 
          />

          <main className={classes.mainContent}>
            <AdminHeader />
            <div className={classes.pageContent}>
              
              {/* 3. QUAN TRỌNG: Chỉ render InfoBoard. 
                  Truyền props để InfoBoard tự giãn chiều rộng.
                  InfoBoard sẽ tự quyết định hiển thị CategoryStats hay Dashboard dựa trên URL bên trong nó.
              */}
              <InfoBoard isSidebarCollapsed={isSidebarCollapsed} />
              
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default IndexPage;