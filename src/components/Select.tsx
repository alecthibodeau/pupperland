import React, { useState } from 'react';

/* Interfaces */
import Dog from '../interfaces/Dog';
import SelectProps from '../interfaces/SelectProps';

/* Helpers */
import formatText from '../helpers/format-text';

function Select(props: SelectProps): React.JSX.Element {
  const [selectedDogs, setSelectedDogs] = useState<{ [key: string]: boolean }>({});
  const { formatLettersAndNumbers } = formatText;
  const favoritesCount: number = Object.keys(selectedDogs).length;

  function onClickDog(id: string): void {
    if (selectedDogs[id]) {
      const newSelectedDogs = { ...selectedDogs };
      delete newSelectedDogs[id];
      setSelectedDogs(newSelectedDogs);
    } else {
      setSelectedDogs({ ...selectedDogs, [id]: true });
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

  function renderCard(dog: Dog, index: number): React.JSX.Element {
    const altText = `${dog.name} the ${dog.breed} who is ${dog.age} years old`;
    const isDogSelected = selectedDogs[dog.id];
    return (
      <button
        key={`${index}-${formatLettersAndNumbers(`${dog.name}${dog.breed}`)}`}
        onClick={() => onClickDog(dog.id)}
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
    <>
      <div className="dog-selections">
        <div className="new-search">
          <button onClick={() => props.onClearResults(true)}>
            New Search
          </button>
        </div>
        <div>
          <span>
            {`${favoritesCount} favorite${favoritesCount === 1 ? '' : 's'}`}
          </span>
          <button className="button-clear-favorites" onClick={() => setSelectedDogs({})}>
            Clear
          </button>
        </div>
      </div>
      <div className="dog-cards">
        {props.dogs.map(renderCard)}
      </div>
    </>
  );
}

export default Select;
