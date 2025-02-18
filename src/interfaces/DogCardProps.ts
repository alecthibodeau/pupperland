/* Interfaces */
import Dog from './Dog';

interface DogCardProps {
  dog: Dog;
  isDogSelected: boolean;
  onClickDogCard: (dog: Dog) => void;
}

export default DogCardProps;
