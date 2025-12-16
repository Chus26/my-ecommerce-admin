// // ===== FILE: src/components/SuggestionCheck.jsx (ĐÃ CẬP NHẬT TÌM KIẾM) =====

// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import classes from "./SuggestionCheck.module.css";
// import {
//   axiosGetSuggestionsForReview,
//   axiosReviewSuggestion,
// } from "../services/suggestionServices";
// import { useSelector } from "react-redux";

// const tableStyles = {
//   width: "100%",
//   borderCollapse: "collapse",
//   marginTop: "20px",
//   fontSize: "14px",
// };
// const thStyles = {
//   border: "1px solid #ddd",
//   padding: "12px",
//   textAlign: "left",
//   backgroundColor: "#f4f4f4",
// };
// const tdStyles = {
//   border: "1px solid #ddd",
//   padding: "10px",
//   verticalAlign: "top",
// };
// const inputStyles = {
//   width: "100%",
//   padding: "5px",
//   boxSizing: "border-box",
//   minWidth: "150px",
// };
// const buttonStyles = (color) => ({
//   background: color,
//   color: "white",
//   cursor: "pointer",
//   padding: "5px 10px",
//   border: "none",
//   borderRadius: "4px",
//   marginRight: "5px",
//   fontSize: "12px",
// });

// const SuggestionCheck = () => {
//   const { token, userRole } = useSelector((state) => state.auth);
//   const [allSuggestions, setAllSuggestions] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [notes, setNotes] = useState({});
//   const [reviewingId, setReviewingId] = useState(null);

//   const noteChangeHandler = (suggestionId, value) => {
//     setNotes((prev) => ({ ...prev, [suggestionId]: value }));
//   };

//   const handleSubmitReview = async (suggestionId, reviewStatus) => {
//     if (reviewingId) return;
//     const note = notes[suggestionId] || "";
//     setReviewingId(suggestionId);
//     try {
//       const { suggestion: updatedSuggestion } = await axiosReviewSuggestion(
//         suggestionId,
//         reviewStatus,
//         note
//       );
//       alert(
//         `Đã ${
//           reviewStatus === "approved" ? "phê duyệt" : "từ chối"
//         } gợi ý!`
//       );
//       setAllSuggestions((prev) =>
//         prev.map((s) =>
//           s._id === suggestionId
//             ? {
//                 ...s,
//                 status: reviewStatus,
//                 consultantNote: note,
//                 reviewedBy: updatedSuggestion.reviewedBy,
//               }
//             : s
//         )
//       );
//     } catch (err) {
//       alert("Lỗi: " + (err.response?.data?.message || err.message));
//     } finally {
//       setReviewingId(null);
//     }
//   };

//   const fetchSuggestions = useCallback(async () => {
//     if (
//       token &&
//       token !== "TOKEN EXPIRED" &&
//       (userRole === "admin" || userRole === "consultant")
//     ) {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const data = await axiosGetSuggestionsForReview();
//         if (data && Array.isArray(data.suggestions)) {
//           setAllSuggestions(data.suggestions);
//         } else {
//           setAllSuggestions([]);
//         }
//       } catch (err) {
//         setError(
//           err.response?.data?.message || err.message || "Lỗi không xác định"
//         );
//         setAllSuggestions([]);
//       } finally {
//         setIsLoading(false);
//       }
//     } else {
//       setAllSuggestions([]);
//       if (!token || token === "TOKEN EXPIRED")
//         setError("Vui lòng đăng nhập lại.");
//       else setError("Bạn không có quyền truy cập mục này.");
//     }
//   }, [token, userRole]);

//   useEffect(() => {
//     fetchSuggestions();
//   }, [fetchSuggestions]);

//   const filteredSuggestions = useMemo(() => {
//     const lowerCaseSearch = searchTerm.toLowerCase().trim();
//     if (!lowerCaseSearch) {
//       return allSuggestions;
//     }
//     return allSuggestions.filter((suggestion) => {
//       if (suggestion.userId?.fullName?.toLowerCase().includes(lowerCaseSearch)) {
//         return true;
//       }
//       if (
//         suggestion.mainProductId?.code
//           ?.toLowerCase()
//           .includes(lowerCaseSearch) ||
//         suggestion.mainProductId?.name
//           ?.toLowerCase()
//           .includes(lowerCaseSearch)
//       ) {
//         return true;
//       }
//       const hasRecommendationMatch = suggestion.recommendations.some(
//         (rec) =>
//           rec.productName?.toLowerCase().includes(lowerCaseSearch) ||
//           rec.advice?.toLowerCase().includes(lowerCaseSearch)
//       );
//       if (hasRecommendationMatch) {
//         return true;
//       }
//       return false;
//     });
//   }, [searchTerm, allSuggestions]);

//   return (
//     <div className={classes.suggestionContainer}>
//       <h4 className={classes.title}>Báo Cáo Gợi Ý AI</h4>
//       <p className={classes.breadcrumb}>Ứng dụng / Gợi ý AI</p>

//       {isLoading && <p className={classes.loadingText}>Đang tải báo cáo...</p>}
//       {error && <p className={classes.errorText}>Lỗi: {error}</p>}

//       {!(userRole === "admin" || userRole === "consultant") && !isLoading && (
//         <p className={classes.errorText}>Bạn không có quyền truy cập mục này.</p>
//       )}

//       {(userRole === "admin" || userRole === "consultant") &&
//         !isLoading &&
//         !error && (
//           <div className={classes.tableContainer}>
//             <div className={classes.controls}>
//               <input
//                 type="text"
//                 placeholder="Tìm theo Tên, Mã SP, Gợi ý..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <button onClick={fetchSuggestions} disabled={isLoading}>
//                 {isLoading ? "..." : "Tải lại"}
//               </button>
//             </div>

//             {filteredSuggestions.length === 0 ? (
//               <p className={classes.noSuggestions}>
//                 {searchTerm
//                   ? "Không tìm thấy kết quả phù hợp."
//                   : "Không có dữ liệu gợi ý nào."}
//               </p>
//             ) : (
//               <table className={classes.suggestionTable} style={tableStyles}>
//                 <thead>
//                   <tr>
//                     <th style={thStyles}>Người dùng</th>
//                     <th style={thStyles}>Sản phẩm chính</th>
//                     <th style={thStyles}>Gợi Ý (Tên & Lời khuyên)</th>
//                     <th style={thStyles}>Ghi chú (Consultant)</th>
//                     <th style={thStyles}>Trạng thái / Hành động</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredSuggestions.map((suggestion) => {
//                     const isAnyReviewing = !!reviewingId;
//                     const isThisRowReviewing =
//                       reviewingId === suggestion._id;
//                     return (
//                       <tr key={suggestion._id}>
//                         <td style={tdStyles}>
//                           {suggestion.userId?.fullName ||
//                             suggestion.userId?._id.slice(-6)}
//                           <br />
//                           <small>
//                             {new Date(suggestion.createdAt).toLocaleString(
//                               "vi-VN"
//                             )}
//                           </small>
//                         </td>
//                         <td style={tdStyles}>
//                           {suggestion.mainProductId ? (
//                             <>
//                               <strong
//                                 style={{
//                                   color: "#333",
//                                   fontFamily: "monospace",
//                                   fontSize: "13px",
//                                 }}
//                               >
//                                 {suggestion.mainProductId.code || "NO_CODE"}
//                               </strong>
//                               <br />
//                               {suggestion.mainProductId.name}
//                             </>
//                           ) : (
//                             "N/A"
//                           )}
//                         </td>
//                         <td style={tdStyles}>
//                           <ul className={classes.suggestionList}>
//                             {suggestion.recommendations?.map((rec, idx) => (
//                               <li key={rec.productId || idx}>
//                                 <strong>{rec.productName || "Lỗi"}</strong>:{" "}
//                                 <em>{rec.advice || "N/A"}</em>
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                         <td style={tdStyles}>
//                           {suggestion.status === "pending" ? (
//                             <input
//                               type="text"
//                               style={inputStyles}
//                               placeholder="Ghi chú nếu từ chối..."
//                               value={notes[suggestion._id] || ""}
//                               onChange={(e) =>
//                                 noteChangeHandler(
//                                   suggestion._id,
//                                   e.target.value
//                                 )
//                               }
//                               disabled={isAnyReviewing}
//                             />
//                           ) : (
//                             <em style={{ color: "#555" }}>
//                               {suggestion.consultantNote ||
//                                 "(Không có ghi chú)"}
//                             </em>
//                           )}
//                         </td>
//                         <td style={tdStyles}>
//                           {suggestion.status === "pending" ? (
//                             <div className={classes.actionButtons}>
//                               <button
//                                 style={buttonStyles("#28a745")}
//                                 onClick={() =>
//                                   handleSubmitReview(
//                                     suggestion._id,
//                                     "approved"
//                                   )
//                                 }
//                                 disabled={isAnyReviewing}
//                               >
//                                 {isThisRowReviewing ? "..." : "Duyệt"}
//                               </button>
//                               <button
//                                 style={buttonStyles("#dc3545")}
//                                 onClick={() =>
//                                   handleSubmitReview(
//                                     suggestion._id,
//                                     "rejected"
//                                   )
//                                 }
//                                 disabled={isAnyReviewing}
//                               >
//                                 {isThisRowReviewing ? "..." : "Từ chối"}
//                               </button>
//                             </div>
//                           ) : suggestion.status === "approved" ? (
//                             <strong style={{ color: "#28a745" }}>
//                               Đã Duyệt
//                             </strong>
//                           ) : (
//                             <strong style={{ color: "#dc3545" }}>
//                               Đã Từ Chối
//                             </strong>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}
//     </div>
//   );
// };

// export default SuggestionCheck;

import React, { useEffect, useState, useCallback, useMemo } from "react";
import classes from "./SuggestionCheck.module.css";
import {
  axiosGetSuggestionsForReview,
  axiosReviewSuggestion,
} from "../services/suggestionServices";
import { useSelector } from "react-redux";
import Pagination from "./Pagination"; // <-- ĐÃ IMPORT

// (Các hằng số style giữ nguyên)
const tableStyles = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
  fontSize: "14px",
};
const thStyles = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "left",
  backgroundColor: "#f4f4f4",
};
const tdStyles = {
  border: "1px solid #ddd",
  padding: "10px",
  verticalAlign: "top",
};
const inputStyles = {
  width: "100%",
  padding: "5px",
  boxSizing: "border-box",
  minWidth: "150px",
};
const buttonStyles = (color) => ({
  background: color,
  color: "white",
  cursor: "pointer",
  padding: "5px 10px",
  border: "none",
  borderRadius: "4px",
  marginRight: "5px",
  fontSize: "12px",
});

const ITEMS_PER_PAGE = 5; // Số lượng gợi ý mỗi trang

const SuggestionCheck = () => {
  const { token, userRole } = useSelector((state) => state.auth);
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState({});
  const [reviewingId, setReviewingId] = useState(null);
  
  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);

  // (Hàm noteChangeHandler giữ nguyên)
  const noteChangeHandler = (suggestionId, value) => {
    setNotes((prev) => ({ ...prev, [suggestionId]: value }));
  };

  // (Hàm handleSubmitReview giữ nguyên)
  const handleSubmitReview = async (suggestionId, reviewStatus) => {
    if (reviewingId) return;
    const note = notes[suggestionId] || "";
    setReviewingId(suggestionId);
    try {
      const { suggestion: updatedSuggestion } = await axiosReviewSuggestion(
        suggestionId,
        reviewStatus,
        note
      );
      alert(
        `Đã ${
          reviewStatus === "approved" ? "phê duyệt" : "từ chối"
        } gợi ý!`
      );
      setAllSuggestions((prev) =>
        prev.map((s) =>
          s._id === suggestionId
            ? {
                ...s,
                status: reviewStatus,
                consultantNote: note,
                reviewedBy: updatedSuggestion.reviewedBy,
              }
            : s
        )
      );
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setReviewingId(null);
    }
  };

  // (Hàm fetchSuggestions giữ nguyên)
  const fetchSuggestions = useCallback(async () => {
    if (
      token &&
      token !== "TOKEN EXPIRED" &&
      (userRole === "admin" || userRole === "consultant")
    ) {
      setIsLoading(true);
      setError(null);
      try {
        const data = await axiosGetSuggestionsForReview();
        if (data && Array.isArray(data.suggestions)) {
          setAllSuggestions(data.suggestions);
        } else {
          setAllSuggestions([]);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Lỗi không xác định"
        );
        setAllSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setAllSuggestions([]);
      if (!token || token === "TOKEN EXPIRED")
        setError("Vui lòng đăng nhập lại.");
      else setError("Bạn không có quyền truy cập mục này.");
    }
  }, [token, userRole]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  // (Hàm filteredSuggestions giữ nguyên)
  const filteredSuggestions = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase().trim();
    if (!lowerCaseSearch) {
      return allSuggestions;
    }
    return allSuggestions.filter((suggestion) => {
      if (suggestion.userId?.fullName?.toLowerCase().includes(lowerCaseSearch)) {
        return true;
      }
      if (
        suggestion.mainProductId?.code
          ?.toLowerCase()
          .includes(lowerCaseSearch) ||
        suggestion.mainProductId?.name
          ?.toLowerCase()
          .includes(lowerCaseSearch)
      ) {
        return true;
      }
      const hasRecommendationMatch = suggestion.recommendations.some(
        (rec) =>
          rec.productName?.toLowerCase().includes(lowerCaseSearch) ||
          rec.advice?.toLowerCase().includes(lowerCaseSearch)
      );
      if (hasRecommendationMatch) {
        return true;
      }
      return false;
    });
  }, [searchTerm, allSuggestions]);

  // Logic Phân trang
  const totalPages = Math.ceil(filteredSuggestions.length / ITEMS_PER_PAGE);

  const paginatedSuggestions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredSuggestions.slice(startIndex, endIndex);
  }, [filteredSuggestions, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className={classes.suggestionContainer}>
      <h4 className={classes.title}>GIÁM SÁT GỢI Ý AI</h4>
      <p className={classes.breadcrumb}>Ứng dụng / Gợi ý AI</p>

      {isLoading && <p className={classes.loadingText}>Đang tải báo cáo...</p>}
      {error && <p className={classes.errorText}>Lỗi: {error}</p>}

      {!(userRole === "admin" || userRole === "consultant") && !isLoading && (
        <p className={classes.errorText}>Bạn không có quyền truy cập mục này.</p>
      )}

      {(userRole === "admin" || userRole === "consultant") &&
        !isLoading &&
        !error && (
          <div className={classes.tableContainer}>
            <div className={classes.controls}>
              <input
                type="text"
                placeholder="Tìm theo Tên, Mã SP, Gợi ý..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={fetchSuggestions} disabled={isLoading}>
                {isLoading ? "..." : "Tải lại"}
              </button>
            </div>

            {filteredSuggestions.length === 0 ? (
              <p className={classes.noSuggestions}>
                {searchTerm
                  ? "Không tìm thấy kết quả phù hợp."
                  : "Không có dữ liệu gợi ý nào."}
              </p>
            ) : (
              <table className={classes.suggestionTable} style={tableStyles}>
                <thead>
                  <tr>
                    <th style={thStyles}>Người dùng</th>
                    <th style={thStyles}>Sản phẩm chính</th>
                    <th style={thStyles}>Gợi Ý (Tên & Lời khuyên)</th>
                    <th style={thStyles}>Ghi chú (Consultant)</th>
                    <th style={thStyles}>Trạng thái / Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Map qua paginatedSuggestions */}
                  {paginatedSuggestions.map((suggestion) => {
                    const isAnyReviewing = !!reviewingId;
                    const isThisRowReviewing =
                      reviewingId === suggestion._id;
                    return (
                      <tr key={suggestion._id}>
                        <td style={tdStyles}>
                          {suggestion.userId?.fullName ||
                            suggestion.userId?._id.slice(-6)}
                          <br />
                          <small>
                            {new Date(suggestion.createdAt).toLocaleString(
                              "vi-VN"
                            )}
                          </small>
                        </td>
                        <td style={tdStyles}>
                          {suggestion.mainProductId ? (
                            <>
                              <strong
                                style={{
                                  color: "#333",
                                  fontFamily: "monospace",
                                  fontSize: "13px",
                                }}
                              >
                                {suggestion.mainProductId.code || "NO_CODE"}
                              </strong>
                              <br />
                              {suggestion.mainProductId.name}
                            </>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td style={tdStyles}>
                          <ul className={classes.suggestionList}>
                            {suggestion.recommendations?.map((rec, idx) => (
                              <li key={rec.productId || idx}>
                                <strong>{rec.productName || "Lỗi"}</strong>:{" "}
                                <em>{rec.advice || "N/A"}</em>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td style={tdStyles}>
                          {suggestion.status === "pending" ? (
                            <input
                              type="text"
                              style={inputStyles}
                              placeholder="Ghi chú nếu từ chối..."
                              value={notes[suggestion._id] || ""}
                              onChange={(e) =>
                                noteChangeHandler(
                                  suggestion._id,
                                  e.target.value
                                )
                              }
                              disabled={isAnyReviewing}
                            />
                          ) : (
                            <em style={{ color: "#555" }}>
                              {suggestion.consultantNote ||
                                "(Không có ghi chú)"}
                            </em>
                          )}
                        </td>
                        <td style={tdStyles}>
                          {suggestion.status === "pending" ? (
                            <div className={classes.actionButtons}>
                              <button
                                style={buttonStyles("#28a745")}
                                onClick={() =>
                                  handleSubmitReview(
                                    suggestion._id,
                                    "approved"
                                  )
                                }
                                disabled={isAnyReviewing}
                              >
                                {isThisRowReviewing ? "..." : "Duyệt"}
                              </button>
                              <button
                                style={buttonStyles("#dc3545")}
                                onClick={() =>
                                  handleSubmitReview(
                                    suggestion._id,
                                    "rejected"
                                  )
                                }
                                disabled={isAnyReviewing}
                              >
                                {isThisRowReviewing ? "..." : "Từ chối"}
                              </button>
                            </div>
                          ) : suggestion.status === "approved" ? (
                            <strong style={{ color: "#28a745" }}>
                              Đã Duyệt
                            </strong>
                          ) : (
                            <strong style={{ color: "#dc3545" }}>
                              Đã Từ Chối
                            </strong>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

      {/* KHỐI PHÂN TRANG */}
      {(userRole === "admin" || userRole === "consultant") &&
        !isLoading &&
        !error &&
        totalPages > 1 && (
          <div className={classes.paginationContainer}>
            <p className={classes.totalCount}>
              Hiển thị {paginatedSuggestions.length} trên tổng số{" "}
              {filteredSuggestions.length} gợi ý
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              classes={classes}
            />
          </div>
        )}
    </div>
  );
};

export default SuggestionCheck;