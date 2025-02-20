interface PaginationProps {
  currentPageNumber: number;
  displayedButtonsCount: number;
  totalPagesCount: number;
  onClickButtonPageNumber: (page: number) => void;
}

export default PaginationProps;
