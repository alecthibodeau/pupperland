import React, { useState } from 'react';

/* Interfaces */
import Dog from '../interfaces/Dog';

/* Helpers */
import formatText from '../helpers/format-text';

function Select(props: { dogs: Dog[] }): React.JSX.Element {
  const [selectedDogs, setSelectedDogs] = useState<{ [key: string]: boolean }>({});
  const { formatLettersAndNumbers } = formatText;

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
      <div>
        <span>{label}: </span>
        <span>{value}</span>
      </div>
    );
  }

  function renderCard(dog: Dog, index: number): React.JSX.Element {
    const altText = `${dog.name} the ${dog.breed}, who is ${dog.age} years old`;
    return (
      <button
        key={`${index}${formatLettersAndNumbers(`${dog.name}${dog.breed}`)}`}
        onClick={() => onClickDog(dog.id)}
        className={`dog-card-button${selectedDogs[dog.id] ? ' selected' : ''}`}
      >
        <div className="dog-card">
          <img src={dog.img} alt={altText} />
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
      <div className="selected-dogs-count">
        {`Dogs selected: ${Object.keys(selectedDogs).length}`}
      </div>
      <div className="dog-cards">
        {props.dogs.map(renderCard)}
      </div>
    </>
  );
}

export default Select;
