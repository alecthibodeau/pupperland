import { Dispatch, SetStateAction } from 'react';

/* Interfaces */
import Dog from './Dog';

interface SelectProps {
  dogs: Dog[];
  onClearResults: Dispatch<SetStateAction<boolean>>;
}

export default SelectProps;
