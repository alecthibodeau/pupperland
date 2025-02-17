import React, { useState } from 'react';

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

  async function onClickGenerateMatch(): Promise<void> {
    const matchingDogId: string | undefined = await apiDogs.generateMatch(favoriteDogs);
    const matchingDog: Dog | undefined = favoriteDogs.find(dog => dog.id === matchingDogId);
    if (matchingDog) {
      setMatchedDog(matchingDog);
      setFavoriteDogs([]);
    } else {
      alert('No match found. Try again.');
    }
  }

  function isFavoriteDog(dog: Dog): boolean {
    return favoriteDogs.some(favoriteDog => favoriteDog.id === dog.id);
  }

  function onClickDog(dog: Dog): void {
    if (isFavoriteDog(dog)) {
      setFavoriteDogs(favoriteDogs.filter(favoriteDog => favoriteDog.id !== dog.id));
    } else {
      setFavoriteDogs([...favoriteDogs, dog]);
    }
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
    const altText = `${dog.name} the ${dog.breed} whose age is ${dog.age}`;
    const isDogSelected = isFavoriteDog(dog);
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

  function onClickNewSearch(): void {
    props.onClearResults(true);
    setMatchedDog(null);
  }

  return (
    <div className="dogs-select">
      <div className="dogs-selections">
        <div className="new-search">
          <button onClick={onClickNewSearch}>
            New Search
          </button>
        </div>
        {
          favoritesCount ?
          <div>
            <span>
              {`${favoritesCount} favorite${favoritesCount > 1 ? 's' : ''}`}
            </span>
            <button
              onClick={() => setFavoriteDogs([])}
              className="button-clear-favorites"
            >
              Clear Favorites
            </button>
            {
              favoriteDogs.length > 1 ?
              <button onClick={onClickGenerateMatch}>
                Generate Match
              </button> :
              null
            }
          </div> :
          <div>
            {
              matchedDog ?
              <span className="matched-dog-message">
                {`Your match is ${matchedDog.name} the ${matchedDog.breed}!`}
              </span>:
              <span>
                Click at least two favorite dogs before generating a match.
              </span>
            }
          </div>
        }
      </div>
      {
        matchedDog ?
        <div className="matched-dog">
          <img
            src={matchedDog.img}
            alt={`${matchedDog.name} the ${matchedDog.breed}`}
            className="matched-dog-image"
          />
          <span className="matched-dog-info">
            {`${matchedDog.name} is age ${matchedDog.age} and from ${matchedDog.zip_code}.`}
          </span>
        </div> :
        <div className="dog-cards">
          {props.dogs.map(renderCard)}
        </div>
      }
    </div>
  );
}

export default DogsSelect;
