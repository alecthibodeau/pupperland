import React, { useEffect, useRef, useState } from 'react';

/* Components */
import ButtonFilter from './ButtonFilter';
import DogsSelect from './DogsSelect';
import Loader from './Loader';
import SelectAgeContainer from './SelectAgeContainer';

/* Interfaces */
import APISearchDogsProps from '../interfaces/APISearchDogs';
import Dog from '../interfaces/Dog';
import DogsSearchProps from '../interfaces/DogsSearchProps';

/* Constants */
import stringValues from '../constants/string-values';

/* Helpers */
import apiDogs from '../helpers/api-dogs';
import formatText from '../helpers/format-text';

function DogsSearch(props: DogsSearchProps): React.JSX.Element {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isAgeRangeValid, setIsAgeRangeValid] = useState<boolean>(true);
  const [isFetchedResultEmpty, setIsFetchedResultEmpty] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSizeValid, setIsSizeValid] = useState<boolean>(true);
  const [isZipCodeValid, setIsZipCodeValid] = useState<boolean>(true);
  const [maximumAge, setMaximumAge] = useState<string>('');
  const [minimumAge, setMinimumAge] = useState<string>('');
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [selectedZipCodes, setSelectedZipCodes] = useState<string[]>([]);
  const [size, setSize] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const zipCodeInputRef = useRef<HTMLInputElement>(null);
  const { isTextOnlyDigits, formatLettersAndNumbers } = formatText;
  const { userName } = props;
  const {
    selectOptions: { ages },
    texts: { textChoose, textSorry, textMaximum, textMinimum },
  } = stringValues;
  const apiSearchDogsParameters: APISearchDogsProps = {
    maximumAge, minimumAge, size, selectedBreeds, selectedZipCodes
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    (async (): Promise<void> => {
      const fetchedBreeds = await apiDogs.getBreeds();
      setBreeds(fetchedBreeds || []);
    })();
  }, []);

  useEffect(() => {
    if (minimumAge && maximumAge) setIsAgeRangeValid(+minimumAge <= +maximumAge);
  }, [maximumAge, minimumAge]);

  useEffect(() => {
    if (setIsFetchedResultEmpty) setIsFetchedResultEmpty(false);
  }, [maximumAge, minimumAge, selectedBreeds, selectedZipCodes, size, zipCode]);

  async function onClickButtonSearchDogs(): Promise<void> {
    setIsLoading(true);
    window.scrollTo(0, 0);
    const fetchedDogs: Dog[] | undefined = await apiDogs.searchDogs(apiSearchDogsParameters);
    if (fetchedDogs) {
      if (fetchedDogs.length) {
        setDogs(fetchedDogs);
      } else {
        setIsFetchedResultEmpty(true);
      }
      setIsLoading(false);
      resetValidation();
      console.log('Fetched dogs:', fetchedDogs, isFetchedResultEmpty);
    }
  }

  function resetValidation(): void {
    setIsSizeValid(true);
    setIsZipCodeValid(true);
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
    if (zipCode.length !== 5) {
      setIsZipCodeValid(false);
    } else if (!selectedZipCodes.includes(zipCode)) {
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
        onClickButton={onClickButtonFilter}
      />
    );
  }

  function renderSelectAgeContainer(label: string, index: number): React.JSX.Element {
    return (
      <SelectAgeContainer
        key={`${index}${formatLettersAndNumbers(label)}SelectAgeContainer`}
        label={label}
        options={ages}
        onUpdateMinimumAge={setMinimumAge}
        onUpdateMaximumAge={setMaximumAge}
      />
    );
  }

  function handleChangeBreed(event: React.ChangeEvent<HTMLSelectElement>): void {
    const enteredBreed: string = event.target.value;
    if (enteredBreed && !selectedBreeds.includes(enteredBreed)) {
      setSelectedBreeds([...selectedBreeds, enteredBreed]);
    }
  }

  function handleChangeSize(event: React.ChangeEvent<HTMLInputElement>): void {
    const enteredSize: string = event.target.value;
    const lastEnteredCharacter: string = enteredSize.slice(-1);
    if (event.target) {
      if (+enteredSize.slice(0, 5) === 10000) {
        setSize(enteredSize.slice(0, 5));
      } else if (+enteredSize > 10000) {
        setSize(enteredSize.slice(0, -1));
      } else if (enteredSize && (!isTextOnlyDigits(lastEnteredCharacter) || +enteredSize < 1)) {
        setSize(enteredSize.slice(0, -1));
        setIsSizeValid(false);
      } else {
        setSize(enteredSize);
        setIsSizeValid(true);
      }
    }
  }

  function handleChangeZipCode(event: React.ChangeEvent<HTMLInputElement>): void {
    const enteredZipCode: string = event.target.value;
    const lastEnteredCharacter: string = enteredZipCode.slice(-1);
    if (!isZipCodeValid) setIsZipCodeValid(true);
    if (event.target) {
      if (enteredZipCode && !isTextOnlyDigits(lastEnteredCharacter)) {
        setZipCode(enteredZipCode.slice(0, -1));
        setIsZipCodeValid(false);
      } else if (enteredZipCode.length > 5) {
        setZipCode(enteredZipCode.slice(0, 5));
      } else {
        setZipCode(enteredZipCode);
      }
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') onClickButtonAddZipCode();
  }

  return (
    <>
      {isLoading ? <Loader /> : null }
      {
        dogs.length ?
        <DogsSelect
          dogs={dogs}
          onClickButtonNewSearch={enableNewSearch}
          onUpdateMatchedDog={props.onUpdateMatchedDog}
        /> :
        <div className="dogs-search">
          <h1 className="search-heading">
            {`Welcome to Pupperland${userName ? `, ${userName}` : ''}.`}
          </h1>
          <h2 className={`search-message${isFetchedResultEmpty ? ' sorry' : ''}`}>
            {isFetchedResultEmpty ? textSorry : textChoose}
          </h2>
          <section className="search-parameter-container">
            <h3>Breed</h3>
            <div className="search-parameter choose-breeds">
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
          <section className="search-parameter-container">
            <h3>Age</h3>
            <div className="search-parameter choose-age">
              {[textMinimum, textMaximum].map(renderSelectAgeContainer)}
            </div>
            {
              !isAgeRangeValid ?
              <div className="validation-message search-field-validation-message">
                Minimum age must be less than or equal to maximum age.
              </div> :
              null
            }
          </section>
          <section className="search-parameter-container">
            <h3>Search Size</h3>
            <div className="search-parameter choose-size">
              <input
                id="sizeSelect"
                type="text"
                value={size}
                onChange={handleChangeSize}
                className="search-input size-input"
              />
              <label htmlFor="sizeSelect">Choose up to 10,000 dogs searched</label>
            </div>
            {
              !isSizeValid ?
              <div className="validation-message search-field-validation-message">
                Enter a number between 1 and 10,000.
              </div> :
              null
            }
          </section>
          <section className="search-parameter-container">
            <h3>Zip Code</h3>
            <div className="search-parameter choose-zip-code">
              <input
                id="zipCodeSelect"
                type="text"
                ref={zipCodeInputRef}
                value={zipCode}
                onChange={handleChangeZipCode}
                onKeyDown={handleKeyDown}
                className="search-input size-input"
              />
              <button onClick={onClickButtonAddZipCode} className="button-secondary">
                Add
              </button>
              <label htmlFor="zipCodeSelect">
                See if there are any dogs located in specific zip codes
              </label>
            </div>
            {
              !isZipCodeValid ?
              <div className="validation-message search-field-validation-message">
                Enter a valid five-digit zip code.
              </div> :
              null
            }
            <div>
              {selectedZipCodes.map(renderFilterButton)}
            </div>
          </section>
          <button
            onClick={onClickButtonSearchDogs}
            disabled={!isAgeRangeValid}
            className={`
              button-primary button-search-dogs${!isAgeRangeValid ? ' disabled' : ''}
            `}
          >
            Search Dogs
          </button>
        </div>
      }
    </>
  );
}

export default DogsSearch;
