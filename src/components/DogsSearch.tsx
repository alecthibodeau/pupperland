import React, { useCallback, useEffect, useRef, useState } from 'react';

/* Components */
import ButtonFilter from './ButtonFilter';
import DogsSelect from './DogsSelect';

/* Interfaces */
import Dog from '../interfaces/Dog';
import ResultsOfDogsSearch from '../interfaces/ResultsOfDogsSearch';

/* Constants */
import stringValues from '../constants/string-values';

/* Helpers */
import formatText from '../helpers/format-text';
import SelectAgeContainer from './SelectAgeContainer';

function DogsSearch(): React.JSX.Element {
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
  const { isTextOnlyDigits, formatLettersAndNumbers } = formatText;
  const {
    selectOptions: { ages },
    texts: { textChoose, textSorry, textMaximum, textMinimum },
    urls: { urlDogs, urlDogsBreeds, urlDogsSearch }
  } = stringValues;

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

  useEffect(() => {
    if (setIsFetchedResultEmpty) setIsFetchedResultEmpty(false);
  }, [maximumAge, minimumAge, selectedBreeds, selectedZipCodes, size, zipCode]);

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
    setSelectedBreeds(selectedBreeds.filter(
      selectedBreed => selectedBreed !== breed
    ));
  }

  function removeSelectedZipCode(zipCode: string): void {
    setZipCode('');
    setSelectedZipCodes(selectedZipCodes.filter(
      selectedZipCode => selectedZipCode !== zipCode
    ));
  }

  function onClickFilterButton(label: string): void {
    const isZipCode: boolean = isTextOnlyDigits(label);
    if (isZipCode) {
      removeSelectedZipCode(label);
    } else {
      removeSelectedBreed(label);
    }
  }

  function onClickAddZipCode(): void {
    if (!selectedZipCodes.includes(zipCode)) {
      setZipCode('');
      setSelectedZipCodes([...selectedZipCodes, zipCode]);
      if (zipCodeInputRef.current) zipCodeInputRef.current.focus();
    }
  }

  function renderSelectOption(optionLabel: string, index: number): React.JSX.Element {
    return (
      <option
        key={`${index}Option${formatLettersAndNumbers(optionLabel)}`}
        value={optionLabel}>
        {optionLabel}
      </option>
    );
  }

  function renderFilterButton(label: string, index: number): React.JSX.Element {
    return (
      <ButtonFilter
        key={`${index}Button${formatLettersAndNumbers(label)}`}
        label={label}
        onClickButton={label => onClickFilterButton(label.toString())}
      />
    );
  }

  function renderSelectAgeContainer(label: string, index: number): React.JSX.Element {
    return (
      <SelectAgeContainer
        key={`${index}${formatLettersAndNumbers(label)}SelectAgeContainer`}
        label={label}
        options={ages}
        onUpdateMinimumAge={age => {setMinimumAge(age)}}
        onUpdateMaximumAge={age => {setMaximumAge(age)}}
      />
    );
  }

  function handleChangeBreed(event: React.ChangeEvent<HTMLSelectElement>): void {
    if (event.target.value && !selectedBreeds.includes(event.target.value)) {
      setSelectedBreeds([...selectedBreeds, event.target.value]);
    }
  }

  function handleChangeSize(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target) {
      if (!isTextOnlyDigits(event.target.value.slice(-1))) {
        setSize(event.target.value.slice(0, -1));
      } else if (+event.target.value > 10000) {
        setSize('10000');
      } else {
        setSize(event.target.value);
      }
    }
  }

  function handleChangeZipCode(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target) {
      if (!isTextOnlyDigits(event.target.value.slice(-1))) {
        setZipCode(event.target.value.slice(0, -1));
      } else if (event.target.value.length > 5) {
        setZipCode(event.target.value.slice(0, 5));
      } else {
        setZipCode(event.target.value);
      }
    }
  }

  return (
    <>
      {
        dogs.length ?
        <DogsSelect dogs={dogs} onClearResults={enableNewSearch} /> :
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
                onChange={handleChangeBreed}
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
              {[textMinimum, textMaximum].map(renderSelectAgeContainer)}
            </div>
          </section>
          <section>
            <h3>Search Size</h3>
            <div className="choose choose-size">
              <input
                type="text"
                value={size}
                onChange={handleChangeSize}
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
                onChange={handleChangeZipCode}
                className="search-input size-input"
              />
              <button onClick={onClickAddZipCode} className="button-add">
                Add
              </button>
              <span>See if there are any dogs located in specific zip codes</span>
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

export default DogsSearch;
