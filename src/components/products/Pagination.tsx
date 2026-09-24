"use client";

export default function Pagination({
  page,
  totalPages,
  onPage,
  limit,
  onLimit,
}: {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
  limit: number;
  onLimit: (limit: number) => void;
}) {
  const safeTotalPages = Math.max(1, totalPages);
  const start = Math.max(1, Math.min(page - 3, safeTotalPages - 6));
  const end = Math.min(safeTotalPages, start + 6);
  const visiblePages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return (
    <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="page-btn"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          Previous
        </button>

        {visiblePages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={`page-btn ${pageNumber === page ? "bg-slate-900 text-white" : "bg-white text-slate-700"}`}
            onClick={() => onPage(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          className="page-btn"
          disabled={page >= safeTotalPages}
          onClick={() => onPage(page + 1)}
        >
          Next
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-500">
        <span>Rows per page</span>
        <select
          className="input max-w-[110px]"
          value={limit}
          onChange={(e) => onLimit(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </label>
    </div>
  );
}
