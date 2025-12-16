// import React from "react";

// import classes from "./IndexPage.module.css";
// import Sidebar from "../components/Sidebar";
// import InfoBoard from "../components/InfoBoard";


// //Get Authtoken
// import { getAuthToken } from "../utils/auth";

// const IndexPage = () => {
//   //Token
//   const token = getAuthToken();
//   return (
//     <>
//       {token && token !== "TOKEN EXPIRED" && (
//         <div className={classes.index}>
//           <header></header>
//           <main>
//             <Sidebar />
//             <InfoBoard />
//           </main>
//         </div>
//       )}
//     </>
//   );
// };

// export default IndexPage;

import React from "react";
import classes from "./IndexPage.module.css";
import Sidebar from "../components/Sidebar";
import InfoBoard from "../components/InfoBoard";
import AdminHeader from "../components/AdminHeader";
import { getAuthToken } from "../utils/auth";

const IndexPage = () => {
  const token = getAuthToken();

  return (
    <>
      {token && token !== "TOKEN EXPIRED" && (
        <div className={classes.adminLayout}>
          {/* Sidebar được đặt ở đây, nó sẽ fixed */}
          <Sidebar />

          {/* mainContent sẽ chứa Header và nội dung trang */}
          <main className={classes.mainContent}>
            <AdminHeader />
            <div className={classes.pageContent}>
              {/* Nội dung trang của bạn (Dashboard) */}
              <InfoBoard />
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default IndexPage;