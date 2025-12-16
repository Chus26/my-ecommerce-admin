// // ===== FILE: components/ProductForm.jsx (CODE "Level 100" - BỎ CTRL) =====

// import React, { useState, useEffect, useRef, useMemo } from "react";
// import classes from "./ProductForm.module.css";
// import {
//   axiosPostCreateProductAdmin,
//   axiosPatchEditProductAdmin,
// } from "../services/productServices";
// import { getAuthToken } from "../utils/auth";
// import { useNavigate } from "react-router-dom";
// import ErrorModal from "../ui/ErrorModal";
// import { apiGetAllTags } from "../services/tagServices";
// import Select from "react-select";


// // (Các hằng số cấu hình ảnh giữ nguyên)
// const ACCEPT_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
// const SLOTS = 4;
// const MAX_FILE_SIZE = 2 * 1024 * 1024;
// const MIN_WIDTH = 600;
// const MIN_HEIGHT = 600;
// const MAX_WIDTH = 4000;
// const MAX_HEIGHT = 4000;

// const ProductForm = ({ editing, productEdit, productId }) => {
//   const navigate = useNavigate();
//   const token = getAuthToken();
//   const [errors, setErrors] = useState([]);
//   const [showError, setShowError] = useState(false);

//   // ===== STATE: Product (Giữ nguyên) =====
//   const [product, setProduct] = useState({
//     code: productEdit?.code || "",
//     name: productEdit?.name || "",
//     category: productEdit?.category || "",
//     shortDescription: productEdit?.short_desc || "",
//     longDescription: productEdit?.long_desc || "",
//     price: productEdit?.price || "",
//     stock: productEdit?.stock || "",
//     isAccessory: productEdit?.isAccessory || false,
//     compatibilityTags: productEdit?.compatibilityTags || [],
//   });

//   // ===== STATE: Ảnh & Ref (Giữ nguyên) =====
//   const [filesInput, setFilesInput] = useState(Array(SLOTS).fill(null));
//   const [previewUrls, setPreviewUrls] = useState(() => {
//     if (editing && productEdit) {
//       return [
//         productEdit.img1 || null,
//         productEdit.img2 || null,
//         productEdit.img3 || null,
//         productEdit.img4 || null,
//       ];
//     }
//     return Array(SLOTS).fill(null);
//   });
//   const fileInputsRef = useRef(Array(SLOTS).fill(null));

//   // ===== STATE MỚI: Thư viện Tag (Giữ nguyên) =====
//   const [allTags, setAllTags] = useState([]);
//   const [isLoadingTags, setIsLoadingTags] = useState(true);

//   // ===== EFFECT MỚI: Tải thư viện Tag (Giữ nguyên) =====
//   useEffect(() => {
//     apiGetAllTags()
//       .then((data) => {
//         if (data?.tags) {
//           setAllTags(data.tags); 
//         }
//         setIsLoadingTags(false);
//       })
//       .catch((err) => {
//         console.error("Không tải được thư viện tag", err);
//         setIsLoadingTags(false);
//       });
//   }, []); 

//   // ===== Tách Tag ra 4 nhóm (Giữ nguyên) =====
//   // const tagGroups = useMemo(() => {
//   //   if (!allTags || allTags.length === 0)
//   //     return { models: [], lines: [], connectors: [], features: [] };
//   //   return {
//   //     models: allTags.filter((t) => t.type === "product_model"),
//   //     lines: allTags.filter((t) => t.type === "product_line"),
//   //     connectors: allTags.filter((t) => t.type === "connector"),
//   //     features: allTags.filter((t) => t.type === "feature"),
//   //   };
//   // }, [allTags]);
//   // ===== SỬA KHỐI NÀY (useMemo) =====

// // ===== Tách Tag ra 4 nhóm (ĐÃ SỬA) =====
// const tagGroups = useMemo(() => {
//   if (!allTags || allTags.length === 0) {
//     return {
//       models: [],
//       lines: [],
//       connectors: [],
//       features: [],
//       models_and_lines: []
//     };
//   }

//   // Lấy riêng lẻ
//   const models = allTags.filter((t) => t.type === "product_model");
//   const lines = allTags.filter((t) => t.type === "product_line");

//   // Sắp xếp chúng theo tên cho đẹp
//   const combined = [...models, ...lines].sort((a, b) =>
//     a.name.localeCompare(b.name)
//   );

//   return {
//     models: models, // Dùng cho Sản phẩm chính
//     lines: lines, // (Không dùng trực tiếp trong form)
//     connectors: allTags.filter((t) => t.type === "connector"),
//     features: allTags.filter((t) => t.type === "feature"),

//     // ✅ THÊM MỚI: Nhóm hỗn hợp (Model + Dòng)
//     models_and_lines: combined
//   };
// }, [allTags]);


//   // ===== VALIDATION (Giữ nguyên code của bà) =====
//   // ... (isAcceptType, readImageDimensions, validateOneFile) ...
//   const isAcceptType = (file) => ACCEPT_TYPES.includes(file.type);
//   const readImageDimensions = (file) =>
//     new Promise((resolve, reject) => {
//       const url = URL.createObjectURL(file);
//       const img = new Image();
//       img.onload = () => {
//         const w = img.naturalWidth || img.width;
//         const h = img.naturalHeight || img.height;
//         URL.revokeObjectURL(url);
//         resolve({ width: w, height: h });
//       };
//       img.onerror = (err) => {
//         URL.revokeObjectURL(url);
//         reject(err);
//       };
//       img.src = url;
//     });
//   const validateOneFile = async (file, label = "") => {
//     const errs = [];
//     if (!isAcceptType(file)) { errs.push(`${label}Không hỗ trợ định dạng ${file.type || "unknown"}.`); }
//     if (file.size > MAX_FILE_SIZE) { const mb = (file.size / (1024 * 1024)).toFixed(2); const limit = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0); errs.push(`${label}Dung lượng ${mb}MB vượt quá ${limit}MB.`); }
//     try { const { width, height } = await readImageDimensions(file); if (width < MIN_WIDTH || height < MIN_HEIGHT) errs.push(`${label}Kích thước quá nhỏ.`); if (width > MAX_WIDTH || height > MAX_HEIGHT) errs.push(`${label}Kích thước quá lớn.`); } catch { errs.push(`${label}Không đọc được kích thước ảnh.`); }
//     return errs;
//   };

//   // ===== HANDLERS: File (Giữ nguyên code của bà) =====
//   // ... (handleFilesChange, replaceAt, openPickerAt, onClickX, useEffect cleanup) ...
//   const handleFilesChange = async (e) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length !== SLOTS) { alert(`Bạn phải chọn đúng ${SLOTS} ảnh`); e.target.value = null; return; }
//     const allErrors = [];
//     for (let i = 0; i < files.length; i++) { const errs = await validateOneFile(files[i], `Ảnh #${i + 1}: `); allErrors.push(...errs); }
//     if (allErrors.length) { alert(allErrors.join("\n")); e.target.value = null; return; }
//     setFilesInput(files);
//     setPreviewUrls((prev) => { prev.forEach((u) => u?.startsWith?.("blob:") && URL.revokeObjectURL(u)); return files.map((f) => URL.createObjectURL(f)); });
//   };
//   const replaceAt = (idx) => async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const errs = await validateOneFile(file, `Ảnh #${idx + 1}: `);
//     if (errs.length) { alert(errs.join("\n")); e.target.value = null; return; }
//     setFilesInput((prev) => { const next = [...prev]; next[idx] = file; return next; });
//     setPreviewUrls((prev) => { const next = [...prev]; if (next[idx]?.startsWith?.("blob:")) URL.revokeObjectURL(next[idx]); next[idx] = URL.createObjectURL(file); return next; });
//   };
//   const openPickerAt = (idx) => fileInputsRef.current[idx]?.click();
//   const onClickX = (idx) => openPickerAt(idx);
//   useEffect(() => {
//     return () => {
//       previewUrls.forEach((u) => u?.startsWith?.("blob:") && URL.revokeObjectURL(u));
//     };
//   }, [previewUrls]);


//   // ===== HANDLERS: Text (Giữ nguyên) =====
//   const productChangeHandler = (e) => {
//     const { name, value, type, checked } = e.target;
//     setProduct((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // ===============================================
//   // ===== HANDLERS MỚI: Xử lý chọn Tag =====
//   // ===============================================
//   // Xử lý khi chọn 1 tag (cho dropdown chọn 1)
//   const handleSingleTagChange = (groupName, selectedSlug) => {
//     const groupTags = tagGroups[groupName] || [];
//     const otherTags = product.compatibilityTags.filter(slug => 
//       !groupTags.find(t => t.slug === slug) 
//     );
//     const newTags = selectedSlug ? [...otherTags, selectedSlug] : otherTags;
//     setProduct(prev => ({ ...prev, compatibilityTags: newTags }));
//   };
  


//   // ===== SUBMIT FORM (Giữ nguyên) =====
//   const handleProductSubmit = async (e) => {
//     e.preventDefault();
//     // (Toàn bộ logic submit của bà đã đúng 100%, không cần sửa)
//     try {
//       let data;
//       if (editing) {
//         const changed = filesInput.some((f) => f instanceof File);
//         if (changed) {
//           const formData = new FormData();
//           filesInput.forEach((f, i) => { if (f instanceof File) { formData.append("images", f); formData.append("replaceIndexes[]", i); } });
//           formData.append("code", product.code);
//           formData.append("name", product.name);
//           formData.append("category", product.category);
//           formData.append("shortDescription", product.shortDescription);
//           formData.append("longDescription", product.longDescription);
//           formData.append("price", product.price);
//           formData.append("stock", product.stock);
//           formData.append("isAccessory", product.isAccessory);
//           formData.append("compatibilityTags", JSON.stringify(product.compatibilityTags));
//           data = await axiosPatchEditProductAdmin(token, formData, productId, { isMultipart: true });
//         } else {
//           const payload = { ...product }; // Gửi cả object product
//           data = await axiosPatchEditProductAdmin(token, payload, productId, { isMultipart: false });
//         }
//       } else {
//         const has4 = filesInput.filter(Boolean).length === SLOTS;
//         if (!has4) { alert(`Vui lòng chọn đủ ${SLOTS} ảnh`); return; }
//         const formData = new FormData();
//         filesInput.forEach((f) => formData.append("images", f));
//         formData.append("code", product.code);
//         formData.append("name", product.name);
//         formData.append("category", product.category);
//         formData.append("shortDescription", product.shortDescription);
//         formData.append("longDescription", product.longDescription);
//         formData.append("price", product.price);
//         formData.append("stock", product.stock);
//         formData.append("isAccessory", product.isAccessory);
//         formData.append("compatibilityTags", JSON.stringify(product.compatibilityTags));
//         data = await axiosPostCreateProductAdmin(token, formData);
//       }
//       if (data?.errors) { setErrors(data.errors); setShowError(true); return; }
//       if (data?.message) { alert(data.message); return navigate("/?location=products"); }
//     } catch (error) {
//       if (error?.response?.status === 409) { alert("❌ " + (error.response.data?.message || "Mã hàng đã tồn tại!")); return; }
//       console.error(error);
//       alert("Đã xảy ra lỗi không mong muốn!");
//     }
//   };


//   // ===== RENDER =====
//   return (
//     <div className={classes["product-form"]}>
//       {showError && <ErrorModal errors={errors} setShowError={setShowError} />}

//       <form
//         method={editing ? "patch" : "post"}
//         encType="multipart/form-data"
//         onSubmit={handleProductSubmit}
//       >
//         {/* ===== INPUT TEXT (Giữ nguyên) ===== */}
//         {/* ... (code các ô input code, name, category, price, stock) ... */}
//         <div className={classes["form-control"]}>
//           <label htmlFor="code">Mã hàng</label>
//           <input onChange={productChangeHandler} id="code" type="text" name="code" placeholder="VD: MH001" value={product.code} />
//         </div>
//         <div className={classes["form-control"]}>
//           <label htmlFor="name">Tên sản phẩm</label>
//           <input onChange={productChangeHandler} id="name" type="text" name="name" placeholder="Nhập tên sản phẩm" value={product.name} />
//         </div>
//         <div className={classes["form-control"]}>
//           <label htmlFor="category">Danh mục</label>
//           <input onChange={productChangeHandler} type="text" id="category" name="category" placeholder="Nhập danh mục (vd: iphone, airpod...)" value={product.category} />
//         </div>
//         <div className={classes["form-control"]}>
//           <label htmlFor="price">Giá</label>
//           <input onChange={productChangeHandler} type="number" id="price" name="price" min="1" placeholder="Nhập giá" value={product.price} />
//         </div>
//         <div className={classes["form-control"]}>
//           <label htmlFor="stock">Tồn kho</label>
//           <input onChange={productChangeHandler} type="number" id="stock" name="stock" min="0" placeholder="Nhập số lượng tồn" value={product.stock} />
//         </div>

//         {/* ===== ẢNH SẢN PHẨM (Giữ nguyên) ===== */}
//         {/* ... (code các ô input ảnh) ... */}
//         <div className={classes["form-control"]}>
//           <label htmlFor="file">
//             Ảnh sản phẩm <small>(...)</small>
//           </label>
//           <input onChange={handleFilesChange} accept=".jpg,.jpeg,.png,.webp" id="file" type="file" multiple />
//         </div>
//         <div className={classes.previewGrid}>
//           {[0, 1, 2, 3].map((idx) => (
//             <div key={idx} className={classes.previewItem}>
//               <div className={classes.previewTop}>
//                 <span className={classes.previewIndex}>#{idx + 1}</span>
//                 <button type="button" className={classes.btnClose} onClick={() => onClickX(idx)} title="Thay ảnh khác">✕</button>
//               </div>
//               <div className={classes.previewBody} onClick={() => openPickerAt(idx)} title="Nhấp để thay ảnh">
//                 {previewUrls[idx] ? (<img key={previewUrls[idx]} src={previewUrls[idx]} alt={`preview-${idx}`} />) : (<div className={classes.placeholder}><span>Chọn ảnh #{idx + 1}</span></div>)}
//               </div>
//               <input ref={(el) => (fileInputsRef.current[idx] = el)} type="file" accept=".jpg,.jpeg,.png,.webp" className={classes.hiddenInput} onChange={replaceAt(idx)} />
//             </div>
//           ))}
//         </div>

//         {/* ===== MÔ TẢ (Giữ nguyên) ===== */}
//         {/* ... (code các ô textarea) ... */}
//         <div className={classes["form-control"]}>
//           <label htmlFor="shortDescription">Mô tả ngắn</label>
//           <textarea onChange={productChangeHandler} value={product.shortDescription} name="shortDescription" id="shortDescription" rows="3" placeholder="Nhập mô tả ngắn" />
//         </div>
//         <div className={classes["form-control"]}>
//           <label htmlFor="longDescription">Mô tả chi tiết</label>
//           <textarea onChange={productChangeHandler} name="longDescription" id="longDescription" rows="6" placeholder="Nhập mô tả chi tiết" value={product.longDescription} />
//         </div>
//         <fieldset className={classes.aiFieldset}>
//           <legend>Cấu hình AI Gợi ý (Level 100)</legend>
          
//           {isLoadingTags ? (
//             <p>Đang tải thư viện Tag...</p>
//           ) : (
//             <>
//               {/* 1. Checkbox "Là phụ kiện" (Giữ nguyên) */}
//               <div className={classes.toggleWrapper}>
//   <label htmlFor="isAccessory" className={classes.toggleLabel}>
//     Đây Là Phụ Kiện (VD: Ốp lưng, Sạc...)
//   </label>
//   <label className={classes.switch}>
//     <input
//       id="isAccessory"
//       name="isAccessory"
//       type="checkbox"
//       checked={product.isAccessory}
//       onChange={productChangeHandler}
//     />
//     <span className={classes.slider}></span>
//   </label>
// </div>


//               {/* 2. Giao diện MỚI để gán tag */}
              
//               {/* === HIỂN THỊ NẾU LÀ SẢN PHẨM CHÍNH === */}
//               {/* === HIỂN THỊ NẾU LÀ SẢN PHẨM CHÍNH === */}
//           {!product.isAccessory && (
//             <div className={classes.formGrid}>
//             {/* Tag Model (Bản thân) - Single Select */}
//             <div className={classes["form-control"]}>
//               <label>Tag Model (Bản thân)</label>

//               <Select
//                 // ✅ SỬA 1: Dùng nhóm hỗn hợp
//                 options={tagGroups.models_and_lines.map((tag) => ({
//                   value: tag.slug,
//                   label: tag.name,
//                 }))}
//                 placeholder="-- Chọn Model hoặc Dòng --"
//                 isClearable

//                 // ✅ SỬA 2: Logic tìm giá trị cũng phải dùng nhóm hỗn hợp
//                 value={(() => {
//                   const slug = product.compatibilityTags.find((slug) =>
//                     tagGroups.models_and_lines.find((t) => t.slug === slug)
//                   );
//                   const tag = tagGroups.models_and_lines.find((t) => t.slug === slug);
//                   return tag ? { value: tag.slug, label: tag.name } : null;
//                 })()}

//                 // ✅ SỬA 3: Dùng đúng tên group khi change
//                 onChange={(option) =>
//                   handleSingleTagChange(
//                     "models_and_lines",
//                     option ? option.value : ""
//                   )
//                 }
//               />

//               <small>
//                 VD: iPhone 17 thì chọn "iPhone 17". Nếu là dòng chung thì chọn
//                 "Dòng iPhone (Chung)".
//               </small>
//             </div>
//               {/* Tag Cổng sạc - Single Select */}
//               <div className={classes["form-control"]}>
//                 <label>Tag Cổng Sạc</label>
//                 <Select
//                   options={tagGroups.connectors.map(tag => ({
//                     value: tag.slug,
//                     label: tag.name,
//                   }))}
//                   placeholder="-- Chọn Cổng Sạc --"
//                   isClearable
//                   value={
//                     (() => {
//                       const slug = product.compatibilityTags.find(slug =>
//                         tagGroups.connectors.find(t => t.slug === slug)
//                       );
//                       const tag = tagGroups.connectors.find(t => t.slug === slug);
//                       return tag ? { value: tag.slug, label: tag.name } : null;
//                     })()
//                   }
//                   onChange={(option) =>
//                     handleSingleTagChange("connectors", option ? option.value : "")
//                   }
//                 />
//               </div>

//               {/* Tag Tính năng - Multi Select */}
//               <div className={classes["form-control"]}>
//                 <label>Tag Tính Năng (Chọn nhiều)</label>
//                 <Select
//                   options={tagGroups.features.map(tag => ({
//                     value: tag.slug,
//                     label: tag.name,
//                   }))}
//                   isMulti
//                   placeholder="-- Chọn Tính năng --"
//                   value={tagGroups.features
//                     .filter(tag => product.compatibilityTags.includes(tag.slug))
//                     .map(tag => ({ value: tag.slug, label: tag.name }))}
//                   onChange={(selectedOptions) => {
//                     const selectedSlugs = selectedOptions.map(opt => opt.value);
//                     const allSlugs = [...new Set([
//                       ...product.compatibilityTags.filter(
//                         slug => !tagGroups.features.some(t => t.slug === slug)
//                       ),
//                       ...selectedSlugs
//                     ])];
//                     setProduct(prev => ({ ...prev, compatibilityTags: allSlugs }));
//                   }}
//                 />
//               </div>
//             </div>
//           )}

//           {/* === HIỂN THỊ NẾU LÀ PHỤ KIỆN === */}
//           {product.isAccessory && (
//             <div className={classes.formGrid}>
//               {/* Tương thích Model - Multi Select */}
//                {/* Tương thích Model - Multi Select */}
//     <div className={classes["form-control"]}>
//       <label>Tương thích Model (Chọn nhiều)</label>
//       <Select
//         // ✅ SỬA 1: Dùng 'models_and_lines'
//         options={tagGroups.models_and_lines.map(tag => ({
//           value: tag.slug,
//           label: tag.name,
//         }))}
//         isMulti
//         placeholder="-- Chọn Model hoặc Dòng --"
//         // ✅ SỬA 2: Dùng 'models_and_lines'
//         value={tagGroups.models_and_lines
//           .filter(tag => product.compatibilityTags.includes(tag.slug))
//           .map(tag => ({ value: tag.slug, label: tag.name }))}
//         onChange={(selectedOptions) => {
//           const selectedSlugs = selectedOptions.map(opt => opt.value);

//           const allSlugs = [
//             ...new Set([
//               ...product.compatibilityTags.filter(
//                 // ✅ SỬA 3: Dùng 'models_and_lines'
//                 slug =>
//                   !tagGroups.models_and_lines.some(t => t.slug === slug)
//               ),
//               ...selectedSlugs,
//             ]),
//           ];

//           setProduct(prev => ({ ...prev, compatibilityTags: allSlugs }));
//         }}
//       />
//       <small>
//         VD: Ốp lưng iPhone 17 thì chọn "iPhone 17". AirPods thì chọn "Dòng
//         iPhone (Chung)".
//       </small>
//     </div>
//     {/* =============================================== */}

//               {/* Tương thích Cổng Sạc - Multi Select */}
//               <div className={classes["form-control"]}>
//                 <label>Tương thích Cổng Sạc (Chọn nhiều)</label>
//                 <Select
//                   options={tagGroups.connectors.map(tag => ({
//                     value: tag.slug,
//                     label: tag.name,
//                   }))}
//                   isMulti
//                   placeholder="-- Chọn Cổng Sạc --"
//                   value={tagGroups.connectors
//                     .filter(tag => product.compatibilityTags.includes(tag.slug))
//                     .map(tag => ({ value: tag.slug, label: tag.name }))}
//                   onChange={(selectedOptions) => {
//                     const selectedSlugs = selectedOptions.map(opt => opt.value);
//                     const allSlugs = [...new Set([
//                       ...product.compatibilityTags.filter(
//                         slug => !tagGroups.connectors.some(t => t.slug === slug)
//                       ),
//                       ...selectedSlugs
//                     ])];
//                     setProduct(prev => ({ ...prev, compatibilityTags: allSlugs }));
//                   }}
//                 />
//                 <small>VD: Cáp USB-C thì chọn "USB-C".</small>
//               </div>
//               {/* ===============================================
//                 ===== BẮT ĐẦU SỬA LỖI (DÁN KHỐI NÀY VÀO) =====
//                 ===============================================
//               */}
//               {/* Tương thích Tính Năng - Multi Select */}
//               <div className={classes["form-control"]}>
//                 <label>Tương thích Tính Năng (Chọn nhiều)</label>
//                 <Select
//                   options={tagGroups.features.map(tag => ({
//                     value: tag.slug,
//                     label: tag.name,
//                   }))}
//                   isMulti
//                   placeholder="-- Chọn Tính năng --"
//                   value={tagGroups.features
//                     .filter(tag => product.compatibilityTags.includes(tag.slug))
//                     .map(tag => ({ value: tag.slug, label: tag.name }))}
//                   onChange={(selectedOptions) => {
//                     // Logic này sẽ gộp các tag "features" mới
//                     // và giữ lại các tag "models", "connectors" cũ
//                     const selectedSlugs = selectedOptions.map(opt => opt.value);
//                     const allSlugs = [...new Set([
//                       ...product.compatibilityTags.filter(
//                         slug => !tagGroups.features.some(t => t.slug === slug)
//                       ),
//                       ...selectedSlugs
//                     ])];
//                     setProduct(prev => ({ ...prev, compatibilityTags: allSlugs }));
//                   }}
//                 />
//                 <small>VD: Ốp lưng MagSafe thì chọn "Hỗ trợ MagSafe".</small>
//               </div>
//               {/* ===============================================
//                 =============== KẾT THÚC SỬA LỖI ===============
//                 ===============================================
//               */}
//             </div>
//           )}

//             </>
//           )}
//         </fieldset>
//         {/* ======================================================= */}
        
//         <button type="submit">Gửi</button>
//       </form>
//     </div>
//   );
// };

// export default ProductForm;

// ===== FILE: components/ProductForm.jsx (CODE HOÀN CHỈNH) =====

import React, { useState, useEffect, useRef, useMemo } from "react";
import classes from "./ProductForm.module.css";
import {
  axiosPostCreateProductAdmin,
  axiosPatchEditProductAdmin,
} from "../services/productServices";
import { getAuthToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../ui/ErrorModal";
import { apiGetAllTags } from "../services/tagServices";
import Select from "react-select";

// (Các hằng số cấu hình ảnh giữ nguyên)
const ACCEPT_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const SLOTS = 4;
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MIN_WIDTH = 600;
const MIN_HEIGHT = 600;
const MAX_WIDTH = 4000;
const MAX_HEIGHT = 4000;

const ProductForm = ({ editing, productEdit, productId }) => {
  const navigate = useNavigate();
  const token = getAuthToken();
  const [errors, setErrors] = useState([]);
  const [showError, setShowError] = useState(false);

  // ===== STATE: Product (Giữ nguyên) =====
  const [product, setProduct] = useState({
    code: productEdit?.code || "",
    name: productEdit?.name || "",
    category: productEdit?.category || "",
    shortDescription: productEdit?.short_desc || "",
    longDescription: productEdit?.long_desc || "",
    price: productEdit?.price || "",
    stock: productEdit?.stock || "",
    isAccessory: productEdit?.isAccessory || false,
    compatibilityTags: productEdit?.compatibilityTags || [],
  });

  // ===== STATE: Ảnh & Ref (Giữ nguyên) =====
  const [filesInput, setFilesInput] = useState(Array(SLOTS).fill(null));
  const [previewUrls, setPreviewUrls] = useState(() => {
    if (editing && productEdit) {
      return [
        productEdit.img1 || null,
        productEdit.img2 || null,
        productEdit.img3 || null,
        productEdit.img4 || null,
      ];
    }
    return Array(SLOTS).fill(null);
  });
  const fileInputsRef = useRef(Array(SLOTS).fill(null));

  // ===== STATE MỚI: Thư viện Tag (Giữ nguyên) =====
  const [allTags, setAllTags] = useState([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  // ===== EFFECT MỚI: Tải thư viện Tag (Giữ nguyên) =====
  useEffect(() => {
    apiGetAllTags()
      .then((data) => {
        if (data?.tags) {
          setAllTags(data.tags);
        }
        setIsLoadingTags(false);
      })
      .catch((err) => {
        console.error("Không tải được thư viện tag", err);
        setIsLoadingTags(false);
      });
  }, []);

  // ===== Tách Tag ra 4 nhóm (ĐÃ SỬA) =====
  const tagGroups = useMemo(() => {
    if (!allTags || allTags.length === 0) {
      return {
        models: [],
        lines: [],
        connectors: [],
        features: [],
        models_and_lines: [],
      };
    }

    // Lấy riêng lẻ
    const models = allTags.filter((t) => t.type === "product_model");
    const lines = allTags.filter((t) => t.type === "product_line");

    // Sắp xếp chúng theo tên cho đẹp
    const combined = [...models, ...lines].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return {
      models: models,
      lines: lines,
      connectors: allTags.filter((t) => t.type === "connector"),
      features: allTags.filter((t) => t.type === "feature"),

      // ✅ THÊM MỚI: Nhóm hỗn hợp (Model + Dòng)
      models_and_lines: combined,
    };
  }, [allTags]);

  // ===== VALIDATION (Giữ nguyên) =====
  const isAcceptType = (file) => ACCEPT_TYPES.includes(file.type);
  const readImageDimensions = (file) =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        URL.revokeObjectURL(url);
        resolve({ width: w, height: h });
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    });
  const validateOneFile = async (file, label = "") => {
    const errs = [];
    if (!isAcceptType(file)) {
      errs.push(`${label}Không hỗ trợ định dạng ${file.type || "unknown"}.`);
    }
    if (file.size > MAX_FILE_SIZE) {
      const mb = (file.size / (1024 * 1024)).toFixed(2);
      const limit = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
      errs.push(`${label}Dung lượng ${mb}MB vượt quá ${limit}MB.`);
    }
    try {
      const { width, height } = await readImageDimensions(file);
      if (width < MIN_WIDTH || height < MIN_HEIGHT)
        errs.push(`${label}Kích thước quá nhỏ.`);
      if (width > MAX_WIDTH || height > MAX_HEIGHT)
        errs.push(`${label}Kích thước quá lớn.`);
    } catch {
      errs.push(`${label}Không đọc được kích thước ảnh.`);
    }
    return errs;
  };

  // ===== HANDLERS: File (Giữ nguyên) =====
  const handleFilesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length !== SLOTS) {
      alert(`Bạn phải chọn đúng ${SLOTS} ảnh`);
      e.target.value = null;
      return;
    }
    const allErrors = [];
    for (let i = 0; i < files.length; i++) {
      const errs = await validateOneFile(files[i], `Ảnh #${i + 1}: `);
      allErrors.push(...errs);
    }
    if (allErrors.length) {
      alert(allErrors.join("\n"));
      e.target.value = null;
      return;
    }
    setFilesInput(files);
    setPreviewUrls((prev) => {
      prev.forEach((u) => u?.startsWith?.("blob:") && URL.revokeObjectURL(u));
      return files.map((f) => URL.createObjectURL(f));
    });
  };
  const replaceAt = (idx) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const errs = await validateOneFile(file, `Ảnh #${idx + 1}: `);
    if (errs.length) {
      alert(errs.join("\n"));
      e.target.value = null;
      return;
    }
    setFilesInput((prev) => {
      const next = [...prev];
      next[idx] = file;
      return next;
    });
    setPreviewUrls((prev) => {
      const next = [...prev];
      if (next[idx]?.startsWith?.("blob:")) URL.revokeObjectURL(next[idx]);
      next[idx] = URL.createObjectURL(file);
      return next;
    });
  };
  const openPickerAt = (idx) => fileInputsRef.current[idx]?.click();
  const onClickX = (idx) => openPickerAt(idx);
  useEffect(() => {
    return () => {
      previewUrls.forEach(
        (u) => u?.startsWith?.("blob:") && URL.revokeObjectURL(u)
      );
    };
  }, [previewUrls]);

  // ===== HANDLERS: Text (Giữ nguyên) =====
  const productChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ===============================================
  // ===== HANDLERS MỚI: Xử lý chọn Tag =====
  // ===============================================
  
  // (ĐÃ XÓA `handleSingleTagChange` VÌ KHÔNG CẦN NỮA)

  // ===== SUBMIT FORM (Giữ nguyên) =====
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (editing) {
        const changed = filesInput.some((f) => f instanceof File);
        if (changed) {
          const formData = new FormData();
          filesInput.forEach((f, i) => {
            if (f instanceof File) {
              formData.append("images", f);
              formData.append("replaceIndexes[]", i);
            }
          });
          formData.append("code", product.code);
          formData.append("name", product.name);
          formData.append("category", product.category);
          formData.append("shortDescription", product.shortDescription);
          formData.append("longDescription", product.longDescription);
          formData.append("price", product.price);
          formData.append("stock", product.stock);
          formData.append("isAccessory", product.isAccessory);
          formData.append(
            "compatibilityTags",
            JSON.stringify(product.compatibilityTags)
          );
          data = await axiosPatchEditProductAdmin(token, formData, productId, {
            isMultipart: true,
          });
        } else {
          const payload = { ...product }; // Gửi cả object product
          data = await axiosPatchEditProductAdmin(token, payload, productId, {
            isMultipart: false,
          });
        }
      } else {
        const has4 = filesInput.filter(Boolean).length === SLOTS;
        if (!has4) {
          alert(`Vui lòng chọn đủ ${SLOTS} ảnh`);
          return;
        }
        const formData = new FormData();
        filesInput.forEach((f) => formData.append("images", f));
        formData.append("code", product.code);
        formData.append("name", product.name);
        formData.append("category", product.category);
        formData.append("shortDescription", product.shortDescription);
        formData.append("longDescription", product.longDescription);
        formData.append("price", product.price);
        formData.append("stock", product.stock);
        formData.append("isAccessory", product.isAccessory);
        formData.append(
          "compatibilityTags",
          JSON.stringify(product.compatibilityTags)
        );
        data = await axiosPostCreateProductAdmin(token, formData);
      }
      if (data?.errors) {
        setErrors(data.errors);
        setShowError(true);
        return;
      }
      if (data?.message) {
        alert(data.message);
        return navigate("/?location=products");
      }
    } catch (error) {
      if (error?.response?.status === 409) {
        alert("❌ " + (error.response.data?.message || "Mã hàng đã tồn tại!"));
        return;
      }
      console.error(error);
      alert("Đã xảy ra lỗi không mong muốn!");
    }
  };

  // ===== RENDER =====
  return (
    <div className={classes["product-form"]}>
      {showError && <ErrorModal errors={errors} setShowError={setShowError} />}

      <form
        method={editing ? "patch" : "post"}
        encType="multipart/form-data"
        onSubmit={handleProductSubmit}
      >
        {/* ===== INPUT TEXT (Giữ nguyên) ===== */}
        <div className={classes["form-control"]}>
          <label htmlFor="code">Mã hàng</label>
          <input
            onChange={productChangeHandler}
            id="code"
            type="text"
            name="code"
            placeholder="VD: MH001"
            value={product.code}
          />
        </div>
        <div className={classes["form-control"]}>
          <label htmlFor="name">Tên sản phẩm</label>
          <input
            onChange={productChangeHandler}
            id="name"
            type="text"
            name="name"
            placeholder="Nhập tên sản phẩm"
            value={product.name}
          />
        </div>
        <div className={classes["form-control"]}>
          <label htmlFor="category">Danh mục</label>
          <input
            onChange={productChangeHandler}
            type="text"
            id="category"
            name="category"
            placeholder="Nhập danh mục (vd: iphone, airpod...)"
            value={product.category}
          />
        </div>
        <div className={classes["form-control"]}>
          <label htmlFor="price">Giá</label>
          <input
            onChange={productChangeHandler}
            type="number"
            id="price"
            name="price"
            min="1"
            placeholder="Nhập giá"
            value={product.price}
          />
        </div>
        <div className={classes["form-control"]}>
          <label htmlFor="stock">Tồn kho</label>
          <input
            onChange={productChangeHandler}
            type="number"
            id="stock"
            name="stock"
            min="0"
            placeholder="Nhập số lượng tồn"
            value={product.stock}
          />
        </div>

        {/* ===== ẢNH SẢN PHẨM (Giữ nguyên) ===== */}
        <div className={classes["form-control"]}>
          <label htmlFor="file">
            Ảnh sản phẩm <small>(...)</small>
          </label>
          <input
            onChange={handleFilesChange}
            accept=".jpg,.jpeg,.png,.webp"
            id="file"
            type="file"
            multiple
          />
        </div>
        <div className={classes.previewGrid}>
          {[0, 1, 2, 3].map((idx) => (
            <div key={idx} className={classes.previewItem}>
              <div className={classes.previewTop}>
                <span className={classes.previewIndex}>#{idx + 1}</span>
                <button
                  type="button"
                  className={classes.btnClose}
                  onClick={() => onClickX(idx)}
                  title="Thay ảnh khác"
                >
                  ✕
                </button>
              </div>
              <div
                className={classes.previewBody}
                onClick={() => openPickerAt(idx)}
                title="Nhấp để thay ảnh"
              >
                {previewUrls[idx] ? (
                  <img
                    key={previewUrls[idx]}
                    src={previewUrls[idx]}
                    alt={`preview-${idx}`}
                  />
                ) : (
                  <div className={classes.placeholder}>
                    <span>Chọn ảnh #{idx + 1}</span>
                  </div>
                )}
              </div>
              <input
                ref={(el) => (fileInputsRef.current[idx] = el)}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className={classes.hiddenInput}
                onChange={replaceAt(idx)}
              />
            </div>
          ))}
        </div>

        {/* ===== MÔ TẢ (Giữ nguyên) ===== */}
        <div className={classes["form-control"]}>
          <label htmlFor="shortDescription">Mô tả ngắn</label>
          <textarea
            onChange={productChangeHandler}
            value={product.shortDescription}
            name="shortDescription"
            id="shortDescription"
            rows="3"
            placeholder="Nhập mô tả ngắn"
          />
        </div>
        <div className={classes["form-control"]}>
          <label htmlFor="longDescription">Mô tả chi tiết</label>
          <textarea
            onChange={productChangeHandler}
            name="longDescription"
            id="longDescription"
            rows="6"
            placeholder="Nhập mô tả chi tiết"
            value={product.longDescription}
          />
        </div>
        <fieldset className={classes.aiFieldset}>
          <legend>Cấu hình AI Gợi ý (Level 100)</legend>

          {isLoadingTags ? (
            <p>Đang tải thư viện Tag...</p>
          ) : (
            <>
              {/* 1. Checkbox "Là phụ kiện" (Giữ nguyên) */}
              <div className={classes.toggleWrapper}>
                <label htmlFor="isAccessory" className={classes.toggleLabel}>
                  Đây Là Phụ Kiện (VD: Ốp lưng, Sạc...)
                </label>
                <label className={classes.switch}>
                  <input
                    id="isAccessory"
                    name="isAccessory"
                    type="checkbox"
                    checked={product.isAccessory}
                    onChange={productChangeHandler}
                  />
                  <span className={classes.slider}></span>
                </label>
              </div>

              {/* 2. Giao diện MỚI để gán tag */}

              {/* ======================================================= */}
              {/* ===== KHỐI SẢN PHẨM CHÍNH (ĐÃ SỬA HOÀN CHỈNH) ===== */}
              {/* ======================================================= */}
              {!product.isAccessory && (
                <div className={classes.formGrid}>
                  {/* Tag Model/Dòng - Multi Select */}
                  <div className={classes["form-control"]}>
                    <label>Tag Model/Dòng (Chọn nhiều)</label>
                    <Select
                      options={tagGroups.models_and_lines.map((tag) => ({
                        value: tag.slug,
                        label: tag.name,
                      }))}
                      isMulti
                      placeholder="-- Chọn Model và Dòng --"
                      value={tagGroups.models_and_lines
                        .filter((tag) =>
                          product.compatibilityTags.includes(tag.slug)
                        )
                        .map((tag) => ({ value: tag.slug, label: tag.name }))}
                      onChange={(selectedOptions) => {
                        const selectedSlugs = selectedOptions.map(
                          (opt) => opt.value
                        );
                        const allSlugs = [
                          ...new Set([
                            ...product.compatibilityTags.filter(
                              (slug) =>
                                !tagGroups.models_and_lines.some(
                                  (t) => t.slug === slug
                                )
                            ),
                            ...selectedSlugs,
                          ]),
                        ];
                        setProduct((prev) => ({
                          ...prev,
                          compatibilityTags: allSlugs,
                        }));
                      }}
                    />
                    <small>
                      Gán cả Model (vd: iPhone 17 Pro) và Dòng (vd:
                      product_iphone).
                    </small>
                  </div>

                  {/* Tag Cổng sạc - Multi Select */}
                  <div className={classes["form-control"]}>
                    <label>Tag Cổng Sạc (Chọn nhiều)</label>
                    <Select
                      options={tagGroups.connectors.map((tag) => ({
                        value: tag.slug,
                        label: tag.name,
                      }))}
                      isMulti
                      placeholder="-- Chọn Cổng Sạc --"
                      value={tagGroups.connectors
                        .filter((tag) =>
                          product.compatibilityTags.includes(tag.slug)
                        )
                        .map((tag) => ({ value: tag.slug, label: tag.name }))}
                      onChange={(selectedOptions) => {
                        const selectedSlugs = selectedOptions.map(
                          (opt) => opt.value
                        );
                        const allSlugs = [
                          ...new Set([
                            ...product.compatibilityTags.filter(
                              (slug) =>
                                !tagGroups.connectors.some(
                                  (t) => t.slug === slug
                                )
                            ),
                            ...selectedSlugs,
                          ]),
                        ];
                        setProduct((prev) => ({
                          ...prev,
                          compatibilityTags: allSlugs,
                        }));
                      }}
                    />
                  </div>

                  {/* Tag Tính năng - Multi Select (Giữ nguyên) */}
                  <div className={classes["form-control"]}>
                    <label>Tag Tính Năng (Chọn nhiều)</label>
                    <Select
                      options={tagGroups.features.map((tag) => ({
                        value: tag.slug,
                        label: tag.name,
                      }))}
                      isMulti
                      placeholder="-- Chọn Tính năng --"
                      value={tagGroups.features
                        .filter((tag) =>
                          product.compatibilityTags.includes(tag.slug)
                        )
                        .map((tag) => ({ value: tag.slug, label: tag.name }))}
                      onChange={(selectedOptions) => {
                        const selectedSlugs = selectedOptions.map(
                          (opt) => opt.value
                        );
                        const allSlugs = [
                          ...new Set([
                            ...product.compatibilityTags.filter(
                              (slug) =>
                                !tagGroups.features.some((t) => t.slug === slug)
                            ),
                            ...selectedSlugs,
                          ]),
                        ];
                        setProduct((prev) => ({
                          ...prev,
                          compatibilityTags: allSlugs,
                        }));
                      }}
                    />
                  </div>
                </div>
              )}

              {/* === HIỂN THỊ NẾU LÀ PHỤ KIỆN (Giữ nguyên) === */}
              {product.isAccessory && (
                <div className={classes.formGrid}>
                  {/* Tương thích Model - Multi Select */}
                  <div className={classes["form-control"]}>
                    <label>Tương thích Model (Chọn nhiều)</label>
                    <Select
                      options={tagGroups.models_and_lines.map((tag) => ({
                        value: tag.slug,
                        label: tag.name,
                      }))}
                      isMulti
                      placeholder="-- Chọn Model hoặc Dòng --"
                      value={tagGroups.models_and_lines
                        .filter((tag) =>
                          product.compatibilityTags.includes(tag.slug)
                        )
                        .map((tag) => ({ value: tag.slug, label: tag.name }))}
                      onChange={(selectedOptions) => {
                        const selectedSlugs = selectedOptions.map(
                          (opt) => opt.value
                        );

                        const allSlugs = [
                          ...new Set([
                            ...product.compatibilityTags.filter(
                              (slug) =>
                                !tagGroups.models_and_lines.some(
                                  (t) => t.slug === slug
                                )
                            ),
                            ...selectedSlugs,
                          ]),
                        ];

                        setProduct((prev) => ({
                          ...prev,
                          compatibilityTags: allSlugs,
                        }));
                      }}
                    />
                    <small>
                      VD: Ốp lưng iPhone 17 thì chọn "iPhone 17". AirPods thì
                      chọn "Dòng iPhone (Chung)".
                    </small>
                  </div>

                  {/* Tương thích Cổng Sạc - Multi Select */}
                  <div className={classes["form-control"]}>
                    <label>Tương thích Cổng Sạc (Chọn nhiều)</label>
                    <Select
                      options={tagGroups.connectors.map((tag) => ({
                        value: tag.slug,
                        label: tag.name,
                      }))}
                      isMulti
                      placeholder="-- Chọn Cổng Sạc --"
                      value={tagGroups.connectors
                        .filter((tag) =>
                          product.compatibilityTags.includes(tag.slug)
                        )
                        .map((tag) => ({ value: tag.slug, label: tag.name }))}
                      onChange={(selectedOptions) => {
                        const selectedSlugs = selectedOptions.map(
                          (opt) => opt.value
                        );
                        const allSlugs = [
                          ...new Set([
                            ...product.compatibilityTags.filter(
                              (slug) =>
                                !tagGroups.connectors.some(
                                  (t) => t.slug === slug
                                )
                            ),
                            ...selectedSlugs,
                          ]),
                        ];
                        setProduct((prev) => ({
                          ...prev,
                          compatibilityTags: allSlugs,
                        }));
                      }}
                    />
                    <small>VD: Cáp USB-C thì chọn "USB-C".</small>
                  </div>

                  {/* Tương thích Tính Năng - Multi Select */}
                  <div className={classes["form-control"]}>
                    <label>Tương thích Tính Năng (Chọn nhiều)</label>
                    <Select
                      options={tagGroups.features.map((tag) => ({
                        value: tag.slug,
                        label: tag.name,
                      }))}
                      isMulti
                      placeholder="-- Chọn Tính năng --"
                      value={tagGroups.features
                        .filter((tag) =>
                          product.compatibilityTags.includes(tag.slug)
                        )
                        .map((tag) => ({ value: tag.slug, label: tag.name }))}
                      onChange={(selectedOptions) => {
                        const selectedSlugs = selectedOptions.map(
                          (opt) => opt.value
                        );
                        const allSlugs = [
                          ...new Set([
                            ...product.compatibilityTags.filter(
                              (slug) =>
                                !tagGroups.features.some((t) => t.slug === slug)
                            ),
                            ...selectedSlugs,
                          ]),
                        ];
                        setProduct((prev) => ({
                          ...prev,
                          compatibilityTags: allSlugs,
                        }));
                      }}
                    />
                    <small>
                      VD: Ốp lưng MagSafe thì chọn "Hỗ trợ MagSafe".
                    </small>
                  </div>
                </div>
              )}
            </>
          )}
        </fieldset>

        <button type="submit">Gửi</button>
      </form>
    </div>
  );
};

export default ProductForm;