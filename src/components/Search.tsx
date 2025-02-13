import React, { useCallback, useEffect, useState } from 'react';

/* Constants */
import stringValues from '../constants/string-values';

function Search(): React.JSX.Element {
  const [breeds, setBreeds] = useState<string[]>([]);
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
  };

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
    } catch (error) {
      console.error('Error:', error);
    }
  };

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

  return (
    <div className="search">
      <button onClick={searchDogs}>
        Search Dogs
      </button>
      <div>
        {breeds.map(renderBreedName)}
      </div>
    </div>
  );
}

export default Search;
