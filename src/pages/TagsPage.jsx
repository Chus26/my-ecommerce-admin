// // ===== TẠO FILE MỚI: src/pages/admin/TagsPage.jsx =====

// import React, { useState, useEffect } from 'react';
// import classes from './TagsPage.module.css'; // (File CSS ở bước 3)
// import { apiGetAllTags, apiCreateTag, apiDeleteTag, apiUpdateTag } from '../services/tagServices'; // (Bà phải tự tạo file service này nhé!)

// // Biến này để hiển thị tên cho đẹp
// const tagTypeNames = {
//   product_line: "Dòng Sản Phẩm (Chung)",
//   product_model: "Mẫu Sản Phẩm (Cụ thể)",
//   connector: "Cổng Kết Nối",
//   feature: "Tính Năng",
// };

// // Form để Thêm/Sửa
// const TagForm = ({ onSave, currentTag, clearEdit }) => {
//   const [name, setName] = useState("");
//   const [slug, setSlug] = useState("");
//   const [type, setType] = useState("product_model"); // Mặc định
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     if (currentTag) {
//       setName(currentTag.name);
//       setSlug(currentTag.slug);
//       setType(currentTag.type);
//       setIsEditing(true);
//     } else {
//       setName(""); setSlug(""); setType("product_model"); setIsEditing(false);
//     }
//   }, [currentTag]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!name || !slug || !type) {
//       alert("Vui lòng điền đầy đủ Tên, Slug và Loại.");
//       return;
//     }
//     onSave({ name, slug, type });
//   };
  
//   // Tự động tạo slug (cho đỡ mệt)
//   const handleNameChange = (e) => {
//     const newName = e.target.value;
//     setName(newName);
//     if (!isEditing || !slug) { // Chỉ tự tạo slug khi Thêm mới
//       setSlug(newName.toLowerCase()
//                      .replace(/\s+/g, '_') // Thay khoảng trắng bằng _
//                      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Bỏ dấu
//                      .replace(/đ/g, 'd')
//                      .replace(/[^a-z0-9_]/g, '')); // Chỉ giữ ký tự an toàn
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className={classes.form}>
//       <h3>{isEditing ? "Cập nhật Tag" : "Thêm Tag Mới"}</h3>
//       <div className={classes.formControl}>
//         <label>Tên hiển thị (Admin thấy)</label>
//         <input 
//           type="text" 
//           value={name} 
//           onChange={handleNameChange}
//           placeholder="VD: iPhone 17 Pro Max" 
//         />
//       </div>
//       <div className={classes.formControl}>
//         <label>Slug (AI hiểu)</label>
//         <input 
//           type="text" 
//           value={slug} 
//           onChange={(e) => setSlug(e.target.value)}
//           placeholder="VD: product_iphone_17_pro_max"
//         />
//       </div>
//       <div className={classes.formControl}>
//         <label>Loại Tag</label>
//         <select value={type} onChange={(e) => setType(e.target.value)}>
//           <option value="product_model">Mẫu Sản Phẩm (Cụ thể)</option>
//           <option value="product_line">Dòng Sản Phẩm (Chung)</option>
//           <option value="connector">Cổng Kết Nối</option>
//           <option value="feature">Tính Năng</option>
//         </select>
//       </div>
//       <div className={classes.formActions}>
//          <button type="submit" className={classes.btnSave}>{isEditing ? "Lưu Cập Nhật" : "Thêm Tag"}</button>
//          {isEditing && (
//             <button type="button" className={classes.btnCancel} onClick={clearEdit}>Hủy</button>
//          )}
//       </div>
//     </form>
//   );
// };

// // Trang chính
// const TagsPage = () => {
//   const [tags, setTags] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentTag, setCurrentTag] = useState(null); // Tag đang được chọn để sửa

//   // Tải tất cả tag khi mở trang
//   useEffect(() => {
//     apiGetAllTags().then(data => {
//       setTags(data.tags || []);
//       setIsLoading(false);
//     });
//   }, []);

//   // Xử lý khi bấm nút "Thêm/Lưu"
//   const handleSaveTag = async (tagData) => {
//     if (currentTag) {
//       // --- CẬP NHẬT ---
//       const data = await apiUpdateTag(currentTag._id, tagData);
//       if (data.tag) {
//         setTags(prev => prev.map(t => t._id === data.tag._id ? data.tag : t));
//         alert("Cập nhật tag thành công!");
//       } else {
//         alert("LỖI: " + data.message);
//       }
//       setCurrentTag(null); // Xong, reset form

//     } else {
//       // --- THÊM MỚI ---
//       const data = await apiCreateTag(tagData);
//       if (data.tag) {
//         setTags(prev => [data.tag, ...prev]);
//         alert("Thêm tag mới thành công!");
//       } else {
//         alert("LỖI: " + data.message);
//       }
//     }
//   };

//   // Xử lý khi bấm nút "Xóa"
//   const handleDeleteTag = async (tagId) => {
//     if (window.confirm("Bà có chắc muốn xóa tag này không? (Không thể hoàn tác!)")) {
//       const data = await apiDeleteTag(tagId);
//       if (data.tagId) {
//         setTags(prev => prev.filter(t => t._id !== data.tagId));
//         alert("Xóa tag thành công!");
//       } else {
//         alert("LỖI: " + data.message);
//       }
//     }
//   };

//   if (isLoading) {
//     return <div className={classes.container}>Đang tải thư viện Tag...</div>;
//   }

//   return (
//     <div className={classes.container}>
//       <h2>Quản lý Thư viện Tag </h2>
      
//       <TagForm 
//         key={currentTag?._id || 'new'} // Key này để reset form khi bấm "Hủy"
//         onSave={handleSaveTag} 
//         currentTag={currentTag} 
//         clearEdit={() => setCurrentTag(null)}
//       />

//       <div className={classes.tableWrapper}>
//         <table>
//           <thead>
//             <tr>
//               <th>Tên hiển thị (Admin thấy)</th>
//               <th>Slug (AI hiểu)</th>
//               <th>Loại Tag</th>
//               <th>Hành động</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tags.map(tag => (
//               <tr key={tag._id}>
//                 <td>{tag.name}</td>
//                 <td><code className={classes.slug}>{tag.slug}</code></td>
//                 <td>{tagTypeNames[tag.type] || tag.type}</td>
//                 <td className={classes.actions}>
//                   <button onClick={() => setCurrentTag(tag)} className={classes.btnEdit}>Sửa</button>
//                   <button onClick={() => handleDeleteTag(tag._id)} className={classes.btnDelete}>Xóa</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TagsPage;

// ===== FILE: src/pages/admin/TagsPage.jsx =====

import React, { useState, useEffect, useMemo } from "react";
import classes from "./TagsPage.module.css";
import {
  apiGetAllTags,
  apiCreateTag,
  apiDeleteTag,
  apiUpdateTag,
} from "../services/tagServices";

const tagTypeNames = {
  product_line: "Dòng Sản Phẩm (Chung)",
  product_model: "Mẫu Sản Phẩm (Cụ thể)",
  connector: "Cổng Kết Nối",
  feature: "Tính Năng",
};

/* =======================
   PAGINATION COMPONENT
======================= */
const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  const maxPageButtons = 7;
  let startPage, endPage;
  if (totalPages <= maxPageButtons) {
    startPage = 1;
    endPage = totalPages;
  } else {
    const maxPagesBeforeCurrent = Math.floor(maxPageButtons / 2);
    const maxPagesAfterCurrent = Math.ceil(maxPageButtons / 2) - 1;
    if (currentPage <= maxPagesBeforeCurrent) {
      startPage = 1;
      endPage = maxPageButtons;
    } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
      startPage = totalPages - maxPageButtons + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - maxPagesBeforeCurrent;
      endPage = currentPage + maxPagesAfterCurrent;
    }
  }

  const pagesToShow = pageNumbers.slice(startPage - 1, endPage);

  return (
    <nav>
      <ul className={classes.pagination}>
        <li
          className={`${classes.pageItem} ${
            currentPage === 1 ? classes.disabled : ""
          }`}
        >
          <button
            onClick={() => paginate(1)}
            className={classes.pageLink}
            disabled={currentPage === 1}
          >
            « Đầu
          </button>
        </li>
        <li
          className={`${classes.pageItem} ${
            currentPage === 1 ? classes.disabled : ""
          }`}
        >
          <button
            onClick={() => paginate(currentPage - 1)}
            className={classes.pageLink}
            disabled={currentPage === 1}
          >
            ‹ Lùi
          </button>
        </li>

        {pagesToShow.map((number) => (
          <li key={number} className={classes.pageItem}>
            <button
              onClick={() => paginate(number)}
              className={`${classes.pageLink} ${
                currentPage === number ? classes.pageLinkActive : ""
              }`}
            >
              {number}
            </button>
          </li>
        ))}

        <li
          className={`${classes.pageItem} ${
            currentPage === totalPages ? classes.disabled : ""
          }`}
        >
          <button
            onClick={() => paginate(currentPage + 1)}
            className={classes.pageLink}
            disabled={currentPage === totalPages}
          >
            Tiến ›
          </button>
        </li>
        <li
          className={`${classes.pageItem} ${
            currentPage === totalPages ? classes.disabled : ""
          }`}
        >
          <button
            onClick={() => paginate(totalPages)}
            className={classes.pageLink}
            disabled={currentPage === totalPages}
          >
            Cuối »
          </button>
        </li>
      </ul>
    </nav>
  );
};

/* =======================
   TAG FORM COMPONENT
======================= */
const TagForm = ({ onSave, currentTag, clearEdit }) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("product_model");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (currentTag) {
      setName(currentTag.name);
      setSlug(currentTag.slug);
      setType(currentTag.type);
      setIsEditing(true);
    } else {
      setName("");
      setSlug("");
      setType("product_model");
      setIsEditing(false);
    }
  }, [currentTag]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !slug || !type) {
      alert("Vui lòng điền đầy đủ Tên, Slug và Loại.");
      return;
    }
    onSave({ name, slug, type });
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    if (!isEditing || !slug) {
      setSlug(
        newName
          .toLowerCase()
          .replace(/\s+/g, "_")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/[^a-z0-9_]/g, "")
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <h3>{isEditing ? "Cập nhật Tag" : "Thêm Tag Mới"}</h3>

      <div className={classes.formControl}>
        <label>Tên hiển thị (Admin thấy)</label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="VD: iPhone 17 Pro Max"
        />
      </div>

      <div className={classes.formControl}>
        <label>Slug (AI hiểu)</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="VD: product_iphone_17_pro_max"
        />
      </div>

      <div className={classes.formControl}>
        <label>Loại Tag</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="product_model">Mẫu Sản Phẩm (Cụ thể)</option>
          <option value="product_line">Dòng Sản Phẩm (Chung)</option>
          <option value="connector">Cổng Kết Nối</option>
          <option value="feature">Tính Năng</option>
        </select>
      </div>

      <div className={classes.formActions}>
        <button type="submit" className={classes.btnSave}>
          {isEditing ? "Lưu Cập Nhật" : "Thêm Tag"}
        </button>
        {isEditing && (
          <button
            type="button"
            className={classes.btnCancel}
            onClick={clearEdit}
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
};

/* =======================
   MAIN TAGS PAGE
======================= */
const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTag, setCurrentTag] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    apiGetAllTags().then((data) => {
      const fetchedTags = data.tags || [];
      fetchedTags.sort((a, b) => {
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      setTags(fetchedTags);
      setIsLoading(false);
    });
  }, []);

  const filteredTags = useMemo(() => {
    if (filterType === "all") return tags;
    return tags.filter((tag) => tag.type === filterType);
  }, [tags, filterType]);

  const indexOfLastTag = currentPage * itemsPerPage;
  const indexOfFirstTag = indexOfLastTag - itemsPerPage;
  const currentTags = filteredTags.slice(indexOfFirstTag, indexOfLastTag);
  const totalFilteredTags = filteredTags.length;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  };

  const sortLogic = (a, b) => {
    if (a.type < b.type) return -1;
    if (a.type > b.type) return 1;
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  };

  const handleSaveTag = async (tagData) => {
    if (currentTag) {
      const data = await apiUpdateTag(currentTag._id, tagData);
      if (data.tag) {
        setTags((prev) =>
          prev.map((t) => (t._id === data.tag._id ? data.tag : t)).sort(sortLogic)
        );
        alert("Cập nhật tag thành công!");
      } else {
        alert("LỖI: " + data.message);
      }
      setCurrentTag(null);
    } else {
      const data = await apiCreateTag(tagData);
      if (data.tag) {
        setTags((prev) => [data.tag, ...prev].sort(sortLogic));
        setCurrentPage(1);
        alert("Thêm tag mới thành công!");
      } else {
        alert("LỖI: " + data.message);
      }
    }
  };

  const handleDeleteTag = async (tagId) => {
    if (
      window.confirm("Bà có chắc muốn xóa tag này không? (Không thể hoàn tác!)")
    ) {
      const data = await apiDeleteTag(tagId);
      if (data.tagId) {
        setTags((prev) => prev.filter((t) => t._id !== data.tagId));
        const newTotalPages = Math.ceil(
          (totalFilteredTags - 1) / itemsPerPage
        );
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1);
        }
        alert("Xóa tag thành công!");
      } else {
        alert("LỖI: " + data.message);
      }
    }
  };

  if (isLoading)
    return <div className={classes.container}>Đang tải thư viện Tag...</div>;

  return (
    <div className={classes.container}>
      <h2>Quản lý Thư viện Tag (AI)</h2>

      <TagForm
        key={currentTag?._id || "new"}
        onSave={handleSaveTag}
        currentTag={currentTag}
        clearEdit={() => setCurrentTag(null)}
      />

      <div className={classes.filterControl}>
        <label htmlFor="tagFilter">Lọc theo loại:</label>
        <select
          id="tagFilter"
          value={filterType}
          onChange={handleFilterChange}
        >
          <option value="all">Hiển thị tất cả ({tags.length} tags)</option>
          <option value="product_line">Dòng Sản Phẩm (Chung)</option>
          <option value="product_model">Mẫu Sản Phẩm (Cụ thể)</option>
          <option value="connector">Cổng Kết Nối</option>
          <option value="feature">Tính Năng</option>
        </select>
      </div>

      <div className={classes.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Tên hiển thị (Admin thấy)</th>
              <th>Slug (AI hiểu)</th>
              <th>Loại Tag</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentTags.length > 0 ? (
              currentTags.map((tag) => (
                <tr key={tag._id}>
                  <td>{tag.name}</td>
                  <td>
                    <code className={classes.slug}>{tag.slug}</code>
                  </td>
                  <td>{tagTypeNames[tag.type] || tag.type}</td>
                  <td className={classes.actions}>
                    <button
                      onClick={() => setCurrentTag(tag)}
                      className={classes.btnEdit}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag._id)}
                      className={classes.btnDelete}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  {filterType === "all"
                    ? "Không có tag nào."
                    : "Không tìm thấy tag nào thuộc loại này."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalFilteredTags > itemsPerPage && (
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={totalFilteredTags}
          paginate={paginate}
          currentPage={currentPage}
        />
      )}
    </div>
  );
};

export default TagsPage;
