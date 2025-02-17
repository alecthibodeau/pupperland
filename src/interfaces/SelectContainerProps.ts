import { Dispatch, SetStateAction } from 'react';

interface SelectContainerProps {
  label: string;
  options: string[];
  onUpdateMaximumAge: Dispatch<SetStateAction<string>>;
  onUpdateMinimumAge: Dispatch<SetStateAction<string>>;
}

export default SelectContainerProps;
