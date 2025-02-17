import React, { useCallback, useEffect, useRef, useState } from 'react';

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
  const [isFetchedResultEmpty, setIsFetchedResultEmpty] = useState<boolean>(false);
  const [maximumAge, setMaximumAge] = useState<string>('');
  const [minimumAge, setMinimumAge] = useState<string>('');
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [selectedZipCodes, setSelectedZipCodes] = useState<string[]>([]);
  const [size, setSize] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const zipCodeInputRef = useRef<HTMLInputElement>(null);
  const {
    texts: { textChoose, textSorry, textMaximum, textMinimum },
    urls: { urlDogs, urlDogsBreeds, urlDogsSearch }
  } = stringValues;
  const { isTextOnlyNumbersAndFiveCharacters, formatLettersAndNumbers } = formatText;
  const ages: string[] = Array.from({ length: 16 }, (_, index) => (index).toString());

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
    const sizeParam = size ? `&size=${size}` : '';
    const url = new URL(`
      ${urlDogsSearch}?${minAgeParam}${maxAgeParam}${sizeParam}&sort=breed:asc
    `);
    selectedBreeds.forEach(breed => url.searchParams.append('breeds', breed));
    selectedZipCodes.forEach(zipCode => url.searchParams.append('zipCodes', zipCode));
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
      if (fetchedDogs.length) {
        setDogs(fetchedDogs);
      } else {
        setIsFetchedResultEmpty(true);
      }
      console.log('Fetched dogs:', fetchedDogs, isFetchedResultEmpty);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function enableNewSearch(): void {
    setIsFetchedResultEmpty(false);
    setDogs([]);
    setSelectedBreeds([]);
    setMinimumAge('');
    setMaximumAge('');
    setSize('');
    setZipCode('');
    setSelectedZipCodes([]);
  }

  function removeSelectedBreed(breed: string): void {
    resetIsFetchedResultEmpty();
    setSelectedBreeds(selectedBreeds.filter(
      selectedBreed => selectedBreed !== breed
    ));
  }

  function removeSelectedZipCode(zipCode: string): void {
    setZipCode('');
    resetIsFetchedResultEmpty();
    setSelectedZipCodes(selectedZipCodes.filter(
      selectedZipCode => selectedZipCode !== zipCode
    ));
  }

  function resetIsFetchedResultEmpty(): void {
    if (setIsFetchedResultEmpty) setIsFetchedResultEmpty(false);
  }

  function onFilterButtonClick(label: string): void {
    const isZipCode: boolean = isTextOnlyNumbersAndFiveCharacters(label);
    if (isZipCode) {
      removeSelectedZipCode(label);
    } else {
      removeSelectedBreed(label);
    }
  }

  function onAgeChange(age: string, parameter: string): void {
    if (parameter === textMinimum) {
      setMinimumAge(age);
    } else if (parameter === textMaximum) {
      setMaximumAge(age);
    }
  }

  function onZipCodeAdd(): void {
    if (!selectedZipCodes.includes(zipCode)) {
      setZipCode('');
      setSelectedZipCodes([...selectedZipCodes, zipCode]);
      if (zipCodeInputRef.current) zipCodeInputRef.current.focus();
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
        onClickButton={label => onFilterButtonClick(label.toString())}
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
            resetIsFetchedResultEmpty();
            if (event.target.value) onAgeChange(event.target.value, label);
          }}
          className="search-select age-select"
        >
          <option value=""></option>
          {ages.map(renderSelectOption)}
        </select>
        <label>
          <span>{label}</span> <span>age in years</span>
        </label>
      </div>
    );
  }

  function handleBreedChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    resetIsFetchedResultEmpty();
    if (event.target.value && !selectedBreeds.includes(event.target.value)) {
      setSelectedBreeds([...selectedBreeds, event.target.value]);
    }
  }

  function handleSizeChange(event: React.ChangeEvent<HTMLInputElement>): void {
    resetIsFetchedResultEmpty();
    if (event.target) {
      if (+event.target.value > 10000) {
        setSize('10000');
      } else {
        setSize(event.target.value);
      }
    }
  }

  function handleZipCodeChange(event: React.ChangeEvent<HTMLInputElement>): void {
    resetIsFetchedResultEmpty();
    if (event.target) {
      if (!isTextOnlyNumbersAndFiveCharacters(event.target.value)) {
        setZipCode('');
      } else {
        setZipCode(event.target.value);
      }
    }
  }

  return (
    <>
      {
        dogs.length ?
        <Select dogs={dogs} onClearResults={enableNewSearch} /> :
        <div className="search">
          <h1>
            Which pupper are you looking for?
          </h1>
          <h2 className={`search-message${isFetchedResultEmpty ? ' sorry' : ''}`}>
            {isFetchedResultEmpty ? textSorry : textChoose}
          </h2>
          <section>
            <h3>Breed</h3>
            <div className="choose choose-breeds">
              <select
                onChange={handleBreedChange}
                className="search-select"
              >
                <option value="">Select a breed</option>
                {breeds.map(renderSelectOption)}
              </select>
              <span>Choose as many breeds as you wish</span>
            </div>
            <div>
              {selectedBreeds.map(renderFilterButton)}
            </div>
          </section>
          <section>
            <h3>Age</h3>
            <div className="choose choose-age">
              {[textMinimum, textMaximum].map(renderAgeSelectContainer)}
            </div>
          </section>
          <section>
            <h3>Search Size</h3>
            <div className="choose choose-size">
              <input
                type="number"
                value={size}
                onChange={handleSizeChange}
                className="search-input size-input"
              />
              <span>Choose up to 10,000 dogs searched</span>
            </div>
          </section>
          <section>
            <h3>Zip Code</h3>
            <div className="choose choose-zip-code">
              <input
                type="text"
                ref={zipCodeInputRef}
                value={zipCode}
                onChange={handleZipCodeChange}
                className="search-input size-input"
              />
              <button onClick={onZipCodeAdd} className="button-add">
                Add
              </button>
            </div>
            <div>
              {selectedZipCodes.map(renderFilterButton)}
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
