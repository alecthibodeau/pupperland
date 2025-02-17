import { Dispatch, SetStateAction } from 'react';

interface ButtonFilterProps {
  label: string;
  onClickButton: Dispatch<SetStateAction<string>>;
}

export default ButtonFilterProps;
