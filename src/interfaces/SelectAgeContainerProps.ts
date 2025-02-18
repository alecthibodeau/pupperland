import { Dispatch, SetStateAction } from 'react';

interface SelectAgeContainerProps {
  label: string;
  options: string[];
  onUpdateMaximumAge: Dispatch<SetStateAction<string>>;
  onUpdateMinimumAge: Dispatch<SetStateAction<string>>;
}

export default SelectAgeContainerProps;
