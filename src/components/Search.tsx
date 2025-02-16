import React, { useCallback, useEffect, useState } from 'react';

/* Components */
import Select from './Select';

/* Interfaces */
import Dog from '../interfaces/Dog';
import ResultsOfDogsSearch from '../interfaces/ResultsOfDogsSearch';

/* Constants */
import stringValues from '../constants/string-values';
import svgPaths from '../constants/svg-paths';

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
      const response: Response = await fetch(urlDogsBreeds, {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const availableBreeds: string[] = await response.json();
      setBreeds(availableBreeds);
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
      const response: Response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const resultsOfDogsSearch: ResultsOfDogsSearch = await response.json();
      console.log('Results of dogs search:', resultsOfDogsSearch);
      fetchDogs(resultsOfDogsSearch.resultIds);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function fetchDogs(resultIds: string[]): Promise<void> {
    const maximumAllowedIds = resultIds.slice(0, 100);
    try {
      const response: Response = await fetch(urlDogs, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(maximumAllowedIds),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const fetchedDogs: Dog[] = await response.json();
      console.log('Fetched dogs:', fetchedDogs);
      setDogs(fetchedDogs);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function enableNewSearch(): void {
    setDogs([]);
    setSelectedBreeds([]);
  }

  function onBreedSelect(breed: string): void {
    if (!selectedBreeds.includes(breed)) {
      setSelectedBreeds([...selectedBreeds, breed]);
    }
  }

  function removeFavoriteBreed(breed: string): void {
    setSelectedBreeds(selectedBreeds.filter(
      selectedBreed => selectedBreed !== breed
    ));
  }

  function renderBreedListItem(breedName: string, index: number): React.JSX.Element {
    return (
      <option
        key={`${index}Option${formatLettersAndNumbers(breedName)}`}
        value={breedName}>
        {breedName}
      </option>
    );
  }

  function renderBreedButton(breedName: string, index: number): React.JSX.Element {
    return (
      <button
        key={`${index}Option${formatLettersAndNumbers(breedName)}`}
        onClick={() => removeFavoriteBreed(breedName)}
      >
        <span>
          {breedName}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 420 420"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points={svgPaths.closingX} />
        </svg>
      </button>
    );
  }

  return (
    <div className="search">
      {
        dogs.length ?
        <Select dogs={dogs} onClearResults={enableNewSearch} /> :
        <div>
          <div>
            What kind of dog are you looking for?
          </div>
          <button onClick={searchDogs}>
            Search Dogs
          </button>
          <div>
            <select onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              if (event.target.value) onBreedSelect(event.target.value);
            }}>
              <option value="">Select a breed</option>
              {breeds.map(renderBreedListItem)}
            </select>
          </div>
          <div>
            {selectedBreeds.map(renderBreedButton)}
          </div>
        </div>
      }
    </div>
  );
}

export default Search;
