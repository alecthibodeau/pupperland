import React, { useCallback, useEffect, useState } from 'react';

/* Components */
import Select from './Select';

/* Interfaces */
import Dog from '../interfaces/Dog';

/* Constants */
import stringValues from '../constants/string-values';

/* Helpers */
import formatText from '../helpers/format-text';

function Search(): React.JSX.Element {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const { urls: { urlDogs, urlDogsBreeds, urlDogsSearch } } = stringValues;
  const { formatLettersAndNumbers } = formatText;

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
      fetchDogs(data.resultIds);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function fetchDogs(resultIds: string[]): Promise<void> {
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
      <div key={`${index}-${formattedBreedName}`}>
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

  function enableNewSearch(): void {
    setDogs([]);
    setSelectedBreeds([]);
  }

  return (
    <div className="search">
      {
        dogs.length ?
        <Select dogs={dogs} onClearResults={enableNewSearch} /> :
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
