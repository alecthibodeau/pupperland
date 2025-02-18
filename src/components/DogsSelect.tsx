import React, { useState } from 'react';

/* Components */
import DogCard from './DogCard';
import MatchedDog from './MatchedDog';

/* Interfaces */
import Dog from '../interfaces/Dog';
import DogsSelectProps from '../interfaces/DogsSelectProps';

/* Helpers */
import apiDogs from '../helpers/api-dogs';
import formatText from '../helpers/format-text';

function DogsSelect(props: DogsSelectProps): React.JSX.Element {
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const { formatLettersAndNumbers } = formatText;
  const favoritesCount: number = favoriteDogs.length;

  async function onClickMatchButton(): Promise<void> {
    const matchingDogId: string | undefined = await apiDogs.generateMatch(favoriteDogs);
    const matchingDog: Dog | undefined = favoriteDogs.find(dog => dog.id === matchingDogId);
    if (matchingDog) {
      setMatchedDog(matchingDog);
      setFavoriteDogs([]);
    } else {
      alert('No match found. Try again.');
    }
  }

  function onClickNewSearchButton(): void {
    props.onClickNewSearchButton(true);
    setMatchedDog(null);
  }

  function updateDogStatus(dog: Dog): void {
    if (isFavoriteDog(dog)) {
      setFavoriteDogs(favoriteDogs.filter(favoriteDog => favoriteDog.id !== dog.id));
    } else {
      setFavoriteDogs([...favoriteDogs, dog]);
    }
  }

  function isFavoriteDog(dog: Dog): boolean {
    return favoriteDogs.some(favoriteDog => favoriteDog.id === dog.id);
  }

  function renderDogCard(dog: Dog): React.JSX.Element {
    return (
      <DogCard
        key={`${dog.id}DogCard${formatLettersAndNumbers(`${dog.name}${dog.breed}`)}`}
        dog={dog}
        isDogSelected={isFavoriteDog(dog)}
        onClickDogCard={updateDogStatus}
      />
    );
  }

  return (
    <div className="dogs-select">
      <div className="new-search">
        <button onClick={onClickNewSearchButton} className="button-secondary">
          New Search
        </button>
      </div>
      {
        matchedDog ?
        <MatchedDog matchedDog={matchedDog}/> :
        <div className="dogs-selections">
          <h1>Click at least two favorite dogs to enable match generation</h1>
          <h2>{`${favoritesCount} favorite${favoritesCount !== 1 ? 's' : ''}`}</h2>
          <button
            onClick={() => setFavoriteDogs([])}
            className="button-secondary"
          >
            Clear
          </button>
          <div className="dog-cards">
            {props.dogs.map(renderDogCard)}
          </div>
          {
            favoriteDogs.length > 1 ?
            <button onClick={onClickMatchButton} className="floating-action-button">
              Match
            </button> :
            null
          }
        </div>
      }
    </div>
  );
}

export default DogsSelect;
