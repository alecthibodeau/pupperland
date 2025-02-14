import React, { useCallback, useEffect, useState } from 'react';

/* Interfaces */
import Dog from '../interfaces/Dog';

/* Constants */
import stringValues from '../constants/string-values';

function Search(): React.JSX.Element {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const { urls: { urlDogs, urlDogsBreeds, urlDogsSearch } } = stringValues;
  const allButLettersAndNumbers: RegExp = /[^a-zA-Z0-9]/g;

  const getBreeds = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(urlDogsBreeds, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBreeds(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [urlDogsBreeds]);

  useEffect(() => {
    getBreeds();
  }, [getBreeds]);

  async function searchDogs(): Promise<void> {
    const url = new URL(`${urlDogsSearch}?ageMin=1&ageMax=1`)
    selectedBreeds.forEach(breed => url.searchParams.append('breeds', breed));
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Data:', data.resultIds);
      getDogs(data.resultIds);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function getDogs(resultIds: string[]): Promise<void> {
    try {
      const response = await fetch(urlDogs, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultIds),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Success:', data);
      setDogs(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function formatLettersAndNumbers(text: string): string {
    return text.replace(allButLettersAndNumbers, '');
  }

  function addOrRemoveBreed(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.checked) {
      setSelectedBreeds([...selectedBreeds, event.target.value]);
    } else {
      setSelectedBreeds(selectedBreeds.filter(
        selectedBreed => selectedBreed !== event.target.value
      ));
    }
  }

  function renderBreedName(breedName: string, index: number): React.JSX.Element {
    const formattedBreedName = formatLettersAndNumbers(breedName);
    return (
      <div key={`${index}${formattedBreedName}`}>
        <input
          type="checkbox"
          id={formattedBreedName}
          name={formattedBreedName}
          value={breedName}
          onChange={(event) => addOrRemoveBreed(event)}
        />
        <label htmlFor={formattedBreedName}>
          {breedName}
        </label>
      </div>
    );
  }

  function renderCard(dog: Dog, index: number): React.JSX.Element {
    const altText = `${dog.name} the ${dog.breed}, who is ${dog.age} years old`;
    return (
      <div key={index} className="dog-card">
        <img src={dog.img} alt={altText} />
        <div className="dog-card-info">
          <div>
            <span>Name: </span>
            <span>{dog.name}</span>
          </div>
          <div>
            <span>Age: </span>
            <span>{dog.age}</span>
          </div>
          <div>
            <span>Zip Code: </span>
            <span>{dog.zip_code}</span>
          </div>
          <div>
            <span>Breed: </span>
            <span>{dog.breed}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search">
      {
        dogs.length ?
        <div className="dog-cards">
          {dogs.map(renderCard)}
        </div> :
        <div>
          <button onClick={searchDogs}>
            Search Dogs
          </button>
          <div>
            {breeds.map(renderBreedName)}
          </div>
        </div>
      }
    </div>
  );
}

export default Search;
