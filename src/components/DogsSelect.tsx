import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* Components */
import DogCard from './DogCard';
import Pagination from './Pagination';

/* Interfaces */
import Dog from '../interfaces/Dog';
import DogsSelectProps from '../interfaces/DogsSelectProps';

/* Helpers */
import apiDogs from '../helpers/api-dogs';
import formatText from '../helpers/format-text';

/* Constants */
import stringValues from '../constants/string-values';

function DogsSelect(props: DogsSelectProps): React.JSX.Element {
  const [currentPageNumber, setCurrentPage] = useState<number>(1);
  const [isDogsListAscending, setIsDogsListAscending] = useState<boolean>(true);
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const navigate = useNavigate();
  const { formatLettersAndNumbers } = formatText;
  const {
    characters: { greaterThan, lessThan, doubleGreaterThan, doubleLessThan },
    routes: { routeMatch },
    texts: { textLeft, textRight }
  } = stringValues;
  const dogsAscending: Dog[] = props.dogs;
  const dogsDescending: Dog[] = [...props.dogs].reverse();
  const dogsListSorted: Dog[] = isDogsListAscending ? dogsAscending : dogsDescending;
  const dogsPerPage: number = 10;
  const favoritesCount: number = favoriteDogs.length;
  const isFavoritesCountLessThanTwo: boolean = favoritesCount < 2;
  const indexOfLastDog: number = currentPageNumber * dogsPerPage;
  const indexOfFirstDog: number = indexOfLastDog - dogsPerPage;
  const currentDogs: Dog[] = dogsListSorted.slice(indexOfFirstDog, indexOfLastDog);
  const lastPageNumberRoundedUp: number = Math.ceil(props.dogs.length/dogsPerPage);
  const displayedPageButtonsCount: number = 5;

  async function onClickMatchButton(): Promise<void> {
    const matchingDogId: string | undefined = await apiDogs.generateMatch(favoriteDogs);
    const matchingDog: Dog | undefined = favoriteDogs.find(dog => dog.id === matchingDogId);
    if (matchingDog) {
      props.onUpdateMatchedDog(matchingDog);
      setFavoriteDogs([]);
      navigate(routeMatch);
    } else {
      alert('No match found. Try again.');
    }
  }

  function onClickButtonNewSearch(): void {
    props.onClickButtonNewSearch(true);
  }

  function onClickButtonClear(): void {
    setFavoriteDogs([]);
  }

  function onClickButtonSort(): void {
    setIsDogsListAscending(!isDogsListAscending);
  }

  function onClickButtonPaginationRange(pageNumber: number): void {
    const isIncrementing: boolean = pageNumber > 0;
    if (isIncrementing && currentPageNumber + pageNumber > lastPageNumberRoundedUp) {
      setCurrentPage(lastPageNumberRoundedUp);
    } else if (!isIncrementing && currentPageNumber + pageNumber < 1) {
      setCurrentPage(1);
    } else {
      setCurrentPage(currentPageNumber + pageNumber);
    }
  }

  function updateDogStatus(dog: Dog): void {
    if (isFavoriteDog(dog)) {
      setFavoriteDogs(favoriteDogs.filter(favoriteDog => favoriteDog.id !== dog.id));
    } else {
      setFavoriteDogs([...favoriteDogs, dog]);
    }
  }

  function isFavoriteDog(dog: Dog): boolean {
    return favoriteDogs.some(favoriteDog => favoriteDog.id === dog.id);
  }

  function renderDogCard(dog: Dog): React.JSX.Element {
    return (
      <DogCard
        key={`${dog.id}DogCard${formatLettersAndNumbers(`${dog.name}${dog.breed}`)}`}
        dog={dog}
        isDogSelected={isFavoriteDog(dog)}
        onClickDogCard={updateDogStatus}
      />
    );
  }

  function renderPageRangeButton(increment: number, direction?: string): React.JSX.Element {
    const isLeftSide: boolean = increment < 0;
    const isRightSide: boolean = increment > 0;
    const isVisible: boolean =
      (isLeftSide && currentPageNumber > displayedPageButtonsCount) ||
      (isRightSide && currentPageNumber < lastPageNumberRoundedUp - (displayedPageButtonsCount - 1))
    ;
    let character: string;
    if (Math.abs(increment) === 1) {
      character = isLeftSide ? lessThan : greaterThan;
    } else {
      character = isLeftSide ? doubleLessThan : doubleGreaterThan;
    }
    return (
      <button
        onClick={() => onClickButtonPaginationRange(increment)}
        className={`button-pages-range ${isVisible ? '' : 'hidden'}`}
        aria-labelledby={`${isLeftSide ? 'decrement' : 'increment'} pages`}
      >
        {
          direction ?
          <div className={
            `triangle-${direction === textRight ? textRight : textLeft}`
          }></div>:
          <span>{character}</span>
        }
      </button>
    );
  }

  return (
    <div className="dogs-select">
      <div className="dogs-selections">
        <h1 className="search-results">
          <span>{dogsAscending.length} found</span>
          <button onClick={onClickButtonNewSearch} className="button-secondary">
            New Search
          </button>
        </h1>
        <h2>Click two or more, then Match!</h2>
        <div className="user-actions-container">
          <div className="user-action">
            <span className="user-action-text favorites-count">
              {favoritesCount}
            </span>
            <button onClick={onClickButtonClear} className="button-secondary">
              Clear
            </button>
          </div>
          <div className="user-action">
            <span className={`sort-arrow${isDogsListAscending ? '' : ' descending'}`}>
              {isDogsListAscending ? <span>&darr;</span> : <span>&uarr;</span>}
            </span>
            <button onClick={onClickButtonSort} className="button-secondary">
              Sort
            </button>
          </div>
          <div className="user-action page-counter-container">
            <span>{renderPageRangeButton(-1, textLeft)}</span>
            <span className="user-action-text page-counter">
              {currentPageNumber}/{lastPageNumberRoundedUp}
            </span>
            <span>{renderPageRangeButton(1, textRight)}</span>
          </div>
        </div>
        <div className="dog-cards">
          {currentDogs.map(renderDogCard)}
        </div>
        <div className="user-action pagination-container">
          <div>
            <span>{renderPageRangeButton(-displayedPageButtonsCount)}</span>
            <span>{renderPageRangeButton(-1)}</span>
          </div>
          <Pagination
            currentPageNumber={currentPageNumber}
            displayedButtonsCount={displayedPageButtonsCount}
            totalPagesCount={lastPageNumberRoundedUp}
            onClickButtonPageNumber={setCurrentPage}
          />
          <div>
            <span>{renderPageRangeButton(1)}</span>
            <span>{renderPageRangeButton(displayedPageButtonsCount)}</span>
          </div>
        </div>
        <button
          onClick={onClickMatchButton}
          disabled={isFavoritesCountLessThanTwo}
          className={`
            floating-action-button ${isFavoritesCountLessThanTwo ?
            ' disabled' :
            ''}
          `}
        >
          <span>Match</span>
        </button>
      </div>
    </div>
  );
}

export default DogsSelect;
