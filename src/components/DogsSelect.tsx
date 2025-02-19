import React, { useState } from 'react';

/* Components */
import DogCard from './DogCard';
import MatchedDog from './MatchedDog';
import Pagination from './Pagination';

/* Interfaces */
import Dog from '../interfaces/Dog';
import DogsSelectProps from '../interfaces/DogsSelectProps';

/* Helpers */
import apiDogs from '../helpers/api-dogs';
import formatText from '../helpers/format-text';

function DogsSelect(props: DogsSelectProps): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDogsListAscending, setIsDogsListAscending] = useState<boolean>(true);
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const { formatLettersAndNumbers } = formatText;
  const dogsAscending: Dog[] = props.dogs;
  const dogsDescending: Dog[] = [...props.dogs].reverse();
  const dogsListSorted: Dog[] = isDogsListAscending ? dogsAscending : dogsDescending;
  const dogsPerPage: number = 10;
  const favoritesCount: number = favoriteDogs.length;
  const isFavoritesCountLessThanTwo: boolean = favoritesCount < 2;
  const indexOfLastDog: number = currentPage * dogsPerPage;
  const indexOfFirstDog: number = indexOfLastDog - dogsPerPage;
  const currentDogs: Dog[] = dogsListSorted.slice(indexOfFirstDog, indexOfLastDog);

  async function onClickMatchButton(): Promise<void> {
    const matchingDogId: string | undefined = await apiDogs.generateMatch(favoriteDogs);
    const matchingDog: Dog | undefined = favoriteDogs.find(dog => dog.id === matchingDogId);
    if (matchingDog) {
      setMatchedDog(matchingDog);
      setFavoriteDogs([]);
    } else {
      alert('No match found. Try again.');
    }
  }

  function onClickButtonNewSearch(): void {
    props.onClickButtonNewSearch(true);
    setMatchedDog(null);
  }

  function onClickButtonClear(): void {
    setFavoriteDogs([]);
  }

  function onClickButtonSort(): void {
    setIsDogsListAscending(!isDogsListAscending);
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

  return (
    <div className="dogs-select">
      {
        matchedDog ?
        <MatchedDog matchedDog={matchedDog}/> :
        <div className="dogs-selections">
          <div className="new-search-container">
          </div>
          <h1 className="search-results">
            <span>{dogsAscending.length} puppers found</span>
            <button onClick={onClickButtonNewSearch} className="button-secondary">
              New Search
            </button>
          </h1>
          <h2>Click two or more favorites and then Match.</h2>

          <div className="user-actions-container">
            <div className="user-action">
              <span className="favorites-count">
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
            <div className="user-action">
              <Pagination
                 currentPage={currentPage}
                 dogsPerPage={dogsPerPage}
                 totalDogs={dogsListSorted.length}
                 onClickButtonPageNumber={setCurrentPage}
               />
            </div>
          </div>
          <div className="dog-cards">
            {currentDogs.map(renderDogCard)}
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
      }
    </div>
  );
}

export default DogsSelect;
