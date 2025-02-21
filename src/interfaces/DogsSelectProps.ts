/* Interfaces */
import Dog from './Dog';

interface DogsSelectProps {
  dogs: Dog[];
  onClickButtonNewSearch: (isNewSearch: boolean) => void;
}

export default DogsSelectProps;
