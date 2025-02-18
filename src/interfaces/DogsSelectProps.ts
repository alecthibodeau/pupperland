/* Interfaces */
import Dog from './Dog';

interface DogsSelectProps {
  dogs: Dog[];
  onClickNewSearchButton: (value: boolean) => void;
}

export default DogsSelectProps;
