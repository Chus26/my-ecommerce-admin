import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, classes }) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  // Logic để tạo ra các số trang (vd: 1 ... 4 5 6 ... 10)
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage - half < 1) {
      end = Math.min(totalPages, maxPagesToShow);
    }
    if (currentPage + half > totalPages) {
      start = Math.max(1, totalPages - maxPagesToShow + 1);
    }
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Component này nhận 'classes' từ cha để tái sử dụng CSS
  return (
    <div className={classes.pagination}>
      <button onClick={handlePrev} disabled={currentPage === 1}>
        « Trước
      </button>
      {pageNumbers.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={page === currentPage ? classes.activePage : ""}
          >
            {page}
          </button>
        ) : (
          <span key={`dots-${index}`} className={classes.dots}>
            ...
          </span>
        )
      )}
      <button onClick={handleNext} disabled={currentPage === totalPages}>
        Sau »
      </button>
    </div>
  );
};

export default Pagination;