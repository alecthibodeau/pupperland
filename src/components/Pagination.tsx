import React from 'react';

/* Interfaces */
import PaginationProps from '../interfaces/PaginationProps';

function Pagination(props: PaginationProps): React.JSX.Element {
  const { currentPage, dogsPerPage, totalDogs, onClickButtonPageNumber } = props;
  const lastPageRoundedUp: number = Math.ceil(totalDogs/dogsPerPage);
  const pages: number[] = Array.from({ length: lastPageRoundedUp }, (_, i) => i + 1);

  function renderPageButton(page: number, index: number): React.JSX.Element {
    return (
      <button
        key={index}
        onClick={() => onClickButtonPageNumber(page)}
        className={`button-page-number${page === currentPage ? ' active' : ''}`}
      >
        {page}
      </button>
    );
  }

  return (
    <div className="pagination">
      {pages.map(renderPageButton)}
    </div>
  );
}

export default Pagination;
