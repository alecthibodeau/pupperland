/* Interfaces */
import Dog from './Dog';

interface DogsSelectProps {
  dogs: Dog[];
  onClickButtonNewSearch: (value: boolean) => void;
}

export default DogsSelectProps;
