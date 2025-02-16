import React, { useCallback, useEffect, useState } from 'react';

/* Components */
import FilterButton from './FilterButton';
import Select from './Select';

/* Interfaces */
import Dog from '../interfaces/Dog';
import ResultsOfDogsSearch from '../interfaces/ResultsOfDogsSearch';

/* Constants */
import stringValues from '../constants/string-values';

/* Helpers */
import formatText from '../helpers/format-text';

function Search(): React.JSX.Element {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [maximumAge, setMaximumAge] = useState<string>('');
  const [minimumAge, setMinimumAge] = useState<string>('');
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const {
    texts: { textMaximum, textMinimum },
    urls: { urlDogs, urlDogsBreeds, urlDogsSearch }
  } = stringValues;
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
    const minAgeParam = minimumAge ? `&ageMin=${minimumAge}` : '';
    const maxAgeParam = maximumAge ? `&ageMax=${maximumAge}` : '';
    const url = new URL(`
      ${urlDogsSearch}?${minAgeParam}${maxAgeParam}&sort=breed:asc
    `);
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

  function onAgeSelect(age: string, qualifier: string): void {
    console.log(`${qualifier} age selected:`, age);
    if (qualifier === textMinimum) {
      setMinimumAge(age);
    } else if (qualifier === textMaximum) {
      setMaximumAge(age);
    }
  }

  function renderSelectOption(optionName: string, index: number): React.JSX.Element {
    return (
      <option
        key={`${index}Option${formatLettersAndNumbers(optionName)}`}
        value={optionName}>
        {optionName}
      </option>
    );
  }

  function renderFilterButton(label: string, index: number): React.JSX.Element {
    return (
      <FilterButton
        key={`${index}Button${formatLettersAndNumbers(label)}`}
        label={label}
        onClickButton={(label) => removeFavoriteBreed(label.toString())}
      />
    );
  }

  function renderAgeSelectContainer(label: string, index: number): React.JSX.Element {
    return (
      <div
        key={`${index}${formatLettersAndNumbers(label)}AgeSelectContainer`}
        className="age-select-container"
      >
        <select
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            if (event.target.value) onAgeSelect(event.target.value, label);
          }}
          className="search-select age-select"
        >
          <option value=""></option>
          {Array.from(
            { length: 20 }, (_, index) => (index).toString()
          ).map(renderSelectOption)}
        </select>
        <label>
          <span>{label}</span> <span>age in years</span>
        </label>
      </div>
    );
  }

  return (
    <>
      {
        dogs.length ?
        <Select dogs={dogs} onClearResults={enableNewSearch} /> :
        <div className="search">
          <h1>
            What dog are you looking for?
          </h1>
          <h2>
            Choose your preferences below or just click the search button now to
            see a bunch of dogs!
          </h2>
          <section>
            <h3>Breed</h3>
            <div className="choose-breeds">
              <select
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  if (event.target.value) onBreedSelect(event.target.value);
                }}
                className="search-select"
              >
                <option value="">Select a breed</option>
                {breeds.map(renderSelectOption)}
              </select>
              <span>Select as many breeds as you wish!</span>
            </div>
            <div>
              {selectedBreeds.map(renderFilterButton)}
            </div>
          </section>
          <section>
            <h3>Age</h3>
            <div className="choose-age">
              {[textMinimum, textMaximum].map(renderAgeSelectContainer)}
            </div>
          </section>
          <button onClick={searchDogs} className="button-primary button-search">
            Search Dogs
          </button>
        </div>
      }
    </>
  );
}

export default Search;
