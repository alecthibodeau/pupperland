import React, { useEffect, useRef, useState } from 'react';

/* Components */
import ButtonFilter from './ButtonFilter';
import DogsSelect from './DogsSelect';
import SelectAgeContainer from './SelectAgeContainer';

/* Interfaces */
import APISearchDogsProps from '../interfaces/apiSearchDogsProps';
import Dog from '../interfaces/Dog';

/* Constants */
import stringValues from '../constants/string-values';

/* Helpers */
import apiDogs from '../helpers/api-dogs';
import formatText from '../helpers/format-text';

function DogsSearch(): React.JSX.Element {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isAgeRangeValid, setIsAgeRangeValid] = useState<boolean>(true);
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
  } = stringValues;
  const apiSearchDogsParameters: APISearchDogsProps = {
    maximumAge, minimumAge, size, selectedBreeds, selectedZipCodes
  };

  useEffect(() => {
    (async (): Promise<void> => {
      const breeds = await apiDogs.getBreeds();
      setBreeds(breeds || []);
    })();
  }, []);

  useEffect(() => {
    if (minimumAge && maximumAge) setIsAgeRangeValid(+minimumAge <= +maximumAge);
  }, [maximumAge, minimumAge]);

  useEffect(() => {
    if (setIsFetchedResultEmpty) setIsFetchedResultEmpty(false);
  }, [maximumAge, minimumAge, selectedBreeds, selectedZipCodes, size, zipCode]);

  async function onClickButtonSearchDogs(): Promise<void> {
    const fetchedDogs: Dog[] | undefined = await apiDogs.searchDogs(apiSearchDogsParameters);
    if (fetchedDogs) {
      if (fetchedDogs.length) {
        setDogs(fetchedDogs);
      } else {
        setIsFetchedResultEmpty(true);
      }
      console.log('Fetched dogs:', fetchedDogs, isFetchedResultEmpty);
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

  function onClickButtonFilter(label: string): void {
    const isZipCode: boolean = isTextOnlyDigits(label);
    if (isZipCode) {
      removeSelectedZipCode(label);
    } else {
      removeSelectedBreed(label);
    }
  }

  function onClickButtonAddZipCode(): void {
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
        onClickButton={label => onClickButtonFilter(label.toString())}
      />
    );
  }

  function renderSelectAgeContainer(label: string, index: number): React.JSX.Element {
    return (
      <SelectAgeContainer
        key={`${index}${formatLettersAndNumbers(label)}SelectAgeContainer`}
        label={label}
        options={ages}
        onUpdateMinimumAge={age => setMinimumAge(age)}
        onUpdateMaximumAge={age => setMaximumAge(age)}
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
        <div className="dogs-search">
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
                id="breedSelect"
                onChange={handleChangeBreed}
                className="search-select"
              >
                <option value=""></option>
                {breeds.map(renderSelectOption)}
              </select>
              <label htmlFor="breedSelect">Choose as many breeds as you wish</label>
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
            {
             !isAgeRangeValid ?
              <div className="validation-message-age">
                Minimum age must be less than or equal to maximum age
              </div> :
              null
            }
          </section>
          <section>
            <h3>Search Size</h3>
            <div className="choose choose-size">
              <input
                id="sizeSelect"
                type="text"
                value={size}
                onChange={handleChangeSize}
                className="search-input size-input"
              />
              <label htmlFor="sizeSelect">Choose up to 10,000 dogs searched</label>
            </div>
          </section>
          <section>
            <h3>Zip Code</h3>
            <div className="choose choose-zip-code">
              <input
                id="zipCodeSelect"
                type="text"
                ref={zipCodeInputRef}
                value={zipCode}
                onChange={handleChangeZipCode}
                className="search-input size-input"
              />
              <button onClick={onClickButtonAddZipCode} className="button-add">
                Add
              </button>
              <label htmlFor="zipCodeSelect">
                See if there are any dogs located in specific zip codes
              </label>
            </div>
            <div>
              {selectedZipCodes.map(renderFilterButton)}
            </div>
          </section>
          <button
            onClick={onClickButtonSearchDogs}
            disabled={!isAgeRangeValid}
            className={`button-primary button-search${!isAgeRangeValid ? ' disabled' : ''}`}
          >
            Search Dogs
          </button>
        </div>
      }
    </>
  );
}

export default DogsSearch;
