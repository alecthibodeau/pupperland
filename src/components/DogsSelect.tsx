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
  const isFavoritesCountLessThanTwo: boolean = favoritesCount < 2;

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
      <div className="button-new-search-container">
        <button onClick={onClickNewSearchButton} className="button-secondary">
          New Search
        </button>
      </div>
      {
        matchedDog ?
        <MatchedDog matchedDog={matchedDog}/> :
        <div className="dogs-selections">
          <h1 className="search-results">Search Results</h1>
          <h2 className="instructions">
            Click two or more favorites, then click Match.
          </h2>
          <h3 className="favorites-count-container">
            <span className="favorites-count">
              {`${favoritesCount} favorite${favoritesCount !== 1 ? 's' : ''}`}
            </span>
            <button
              onClick={() => setFavoriteDogs([])}
              className="button-secondary"
            >
              Clear
            </button>
          </h3>
          <div className="dog-cards">
            {props.dogs.map(renderDogCard)}
          </div>
          <button
            onClick={onClickMatchButton}
            disabled={isFavoritesCountLessThanTwo}
            className={`
              floating-action-button ${isFavoritesCountLessThanTwo ?
              ' disabled' :
              ''}
            `}
          >
            <span>Match</span>
          </button>
        </div>
      }
    </div>
  );
}

export default DogsSelect;
