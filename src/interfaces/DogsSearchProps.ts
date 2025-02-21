/* Interfaces */
import Dog from './Dog';

interface DogsSearchProps {
  userName: string;
  onUpdateMatchedDog: (matchedDog: Dog) => void;
}

export default DogsSearchProps;
