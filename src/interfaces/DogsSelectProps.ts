/* Interfaces */
import Dog from './Dog';

interface DogsSelectProps {
  dogs: Dog[];
  onClickButtonNewSearch: (isNewSearch: boolean) => void;
  onUpdateMatchedDog: (matchedDog: Dog) => void;
}

export default DogsSelectProps;
