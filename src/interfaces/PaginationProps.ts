interface PaginationProps {
  currentPage: number;
  dogsPerPage: number;
  totalDogs: number;
  onClickButtonPageNumber: (page: number) => void;
}

export default PaginationProps;
