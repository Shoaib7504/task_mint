"use client";

import { useState, useMemo } from "react";

/**
 * usePagination — Junior-friendly helper to paginate arrays of data.
 *
 * @param {Array} items - List of items to paginate
 * @param {number} itemsPerPage - Number of rows to display per page (default: 10)
 *
 * @example
 * const { paginatedItems, currentPage, totalPages, goToPage, nextPage, prevPage } = usePagination(tasks, 10);
 */
export function usePagination(items = [], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  // Total number of pages
  const totalPages = Math.max(1, Math.ceil((items?.length || 0) / itemsPerPage));

  // Slice array for current page
  const paginatedItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  // Page navigation helpers
  const goToPage = (pageNumber) => {
    const validPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(validPage);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    totalItems: items?.length || 0,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

export default usePagination;
