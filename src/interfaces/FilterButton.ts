import { Dispatch, SetStateAction } from 'react';

interface FilterButtonProps {
  label: string;
  onClickButton: Dispatch<SetStateAction<string>>;
}

export default FilterButtonProps;
