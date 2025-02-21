interface PaginationProps {
  currentPageNumber: number;
  displayedButtonsCount: number;
  totalPagesCount: number;
  onClickButtonPageNumber: (pageNumber: number) => void;
}

export default PaginationProps;
