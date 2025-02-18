import React from 'react';

/* Components */
import Checkmark from './Checkmark';

/* Interfaces */
import DogCardInfoLine from '../interfaces/DogCardInfoLine';
import DogCardProps from '../interfaces/DogCardProps';

function DogCard(props: DogCardProps): React.JSX.Element {
  const { dog, isDogSelected, onClickDogCard } = props;
  const altText: string = `${dog.name} the ${dog.breed} whose age is ${dog.age}`;
  const dogCardInfoLines: DogCardInfoLine[] = [
    {field: 'Breed', value: dog.breed},
    {field: 'Age', value: dog.age.toString()},
    {field: 'Zip Code', value: dog.zip_code}
  ];

  function renderDogCardInfoLine(info: DogCardInfoLine, index: number): React.JSX.Element {
    return (
      <div
        key={`${index}${info.field}${info.value}`}
        className="dog-card-info-line"
      >
        <span>{info.field}: </span>
        <span>{info.value}</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => onClickDogCard(dog)}
      className={`dog-card-button${isDogSelected ? ' selected' : ''}`}
    >
      {isDogSelected ? <Checkmark /> : null}
      <div className={`dog-card${isDogSelected ? ' selected' : ''}`}>
        <img src={dog.img} alt={altText} draggable="false" className="dog-image" />
        <div className="dog-card-info">
          <div className="dog-card-info-name">
            {dog.name}
          </div>
          {dogCardInfoLines.map(renderDogCardInfoLine)}
        </div>
      </div>
    </button>
  );
}

export default DogCard;
