import React from 'react'

// "< 1 / 6 >" pager used under product grids.
const Pagination = ({ page, pageCount, onChange, className = '' }) => {
  if (pageCount <= 1) return null

  return (
    <div className={`flex items-center justify-center gap-3 text-sm ${className}`}>
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label='Previous page'
        className='px-2 disabled:opacity-25 disabled:cursor-not-allowed hover:text-brand transition-colors'
      >
        &lt;
      </button>
      <span className='tabular-nums tracking-wide'>{page} / {pageCount}</span>
      <button
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        aria-label='Next page'
        className='px-2 disabled:opacity-25 disabled:cursor-not-allowed hover:text-brand transition-colors'
      >
        &gt;
      </button>
    </div>
  )
}

export default Pagination
