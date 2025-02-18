import React, { useState } from 'react';

/* Components */
import MatchedDog from './MatchedDog';

/* Interfaces */
import Dog from '../interfaces/Dog';
import SelectProps from '../interfaces/SelectProps';

/* Helpers */
import apiDogs from '../helpers/api-dogs';
import formatText from '../helpers/format-text';

function DogsSelect(props: SelectProps): React.JSX.Element {
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
    props.onClearResults(true);
    setMatchedDog(null);
  }

  function onClickDog(dog: Dog): void {
    if (isFavoriteDog(dog)) {
      setFavoriteDogs(favoriteDogs.filter(favoriteDog => favoriteDog.id !== dog.id));
    } else {
      setFavoriteDogs([...favoriteDogs, dog]);
    }
  }

  function isFavoriteDog(dog: Dog): boolean {
    return favoriteDogs.some(favoriteDog => favoriteDog.id === dog.id);
  }

  function renderInfoLine(label: string, value: string): React.JSX.Element {
    return (
      <div className="dog-card-info-line">
        <span>{label}: </span>
        <span>{value}</span>
      </div>
    );
  }

  function renderCard(dog: Dog): React.JSX.Element {
    const altText: string = `${dog.name} the ${dog.breed} whose age is ${dog.age}`;
    const isDogSelected: boolean = isFavoriteDog(dog);
    return (
      <button
        key={`${dog.id}CardButton${formatLettersAndNumbers(`${dog.name}${dog.breed}`)}`}
        onClick={() => onClickDog(dog)}
        className={`dog-card-button${isDogSelected ? ' selected' : ''}`}
      >
        {
          isDogSelected ?
          <div className="checkmark-container">
            <div className="checkmark">
              <div></div>
              <div></div>
            </div>
          </div> :
          null
        }
        <div className={`dog-card${isDogSelected ? ' selected' : ''}`}>
          <img src={dog.img} alt={altText} className="dog-image"/>
          <div className="dog-card-info">
            <div className="dog-card-info-name">
              {dog.name}
            </div>
            {renderInfoLine('Breed', dog.breed)}
            {renderInfoLine('Age', dog.age.toString())}
            {renderInfoLine('Zip Code', dog.zip_code)}
          </div>
        </div>
      </button>
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
            {props.dogs.map(renderCard)}
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
