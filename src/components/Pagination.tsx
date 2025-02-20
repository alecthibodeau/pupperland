import React from 'react';

/* Interfaces */
import PaginationProps from '../interfaces/PaginationProps';

function Pagination(props: PaginationProps): React.JSX.Element {
  const {
    currentPage,
    displayedButtonsCount,
    totalPagesCount,
    onClickButtonPageNumber
  } = props;
  const pages: number[] = Array.from({ length: totalPagesCount }, (_, i) => i + 1);
  const range: number = displayedButtonsCount;
  const startingIndex: number = Math.floor((currentPage - 1) / range) * range;
  const displayedButtons: number[] = calculateDisplayedButtons();

  function calculateDisplayedButtons(): number[] {
    let buttons: number[];
    if (currentPage <= range) {
      buttons = pages.slice(0, range);
    } else if (currentPage > pages.length - range) {
      buttons = pages.slice(pages.length - range);
    } else {
      buttons = pages.slice(startingIndex, startingIndex + range);
    }
    return buttons;
  }

  function renderPageButton(pageNumber: number): React.JSX.Element {
    return (
      <button
        key={`page${pageNumber}`}
        onClick={() => onClickButtonPageNumber(pageNumber)}
        className={`
          button-page-number${pageNumber === currentPage ? ' active' : ''}
        `}
      >
        {pageNumber}
      </button>
    );
  }

  return (
    <div className="pagination">
      {displayedButtons.map(renderPageButton)}
    </div>
  );
}

export default Pagination;
