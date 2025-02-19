/* Constants */
import stringValues from '../constants/string-values';

/* Interfaces */
import APISearchDogsProps from '../interfaces/APISearchDogsProps';
import Dog from '../interfaces/Dog';
import Match from '../interfaces/Match';
import ResultsOfDogsSearch from '../interfaces/ResultsOfDogsSearch';

const {
  urls: { urlDogs, urlDogsBreeds, urlDogsMatch, urlDogsSearch }
} = stringValues;

async function getBreeds(): Promise<string[] | undefined> {
  try {
    const response: Response = await fetch(urlDogsBreeds, {
      method: 'GET',
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const availableBreeds: string[] = await response.json();
    console.log('Available breeds:', availableBreeds);
    return availableBreeds;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function searchDogs(props: APISearchDogsProps): Promise<Dog[] | undefined> {
  const { minimumAge, maximumAge, size, selectedBreeds, selectedZipCodes } = props;
  const minAgeParam: string = minimumAge ? `&ageMin=${minimumAge}` : '';
  const maxAgeParam: string = maximumAge ? `&ageMax=${maximumAge}` : '';
  const sizeParam: string = size ? `&size=${size}` : '';
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
    return fetchDogs(resultsOfDogsSearch.resultIds);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function fetchDogs(resultIds: string[]): Promise<Dog[] | undefined> {
  const batchSize: number = 100;
  const fetchedDogsTotal: Dog[] = [];
  try {
    for (let i = 0; i < resultIds.length; i += batchSize) {
      const dogsIdsBatch: string[] = resultIds.slice(i, i + batchSize);
      const response: Response = await fetch(urlDogs, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dogsIdsBatch),
        credentials: 'include'
      });
      const fetchedDogsBatch: Dog[] = await response.json();
      fetchedDogsTotal.push(...fetchedDogsBatch);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
  return fetchedDogsTotal;
}

async function generateMatch(favoriteDogs: Dog[]): Promise<string | undefined> {
  const favoriteDogsIds = favoriteDogs.map(dog => dog.id);
  try {
    const response: Response = await fetch(urlDogsMatch, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(favoriteDogsIds),
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const match: Match = await response.json();
    const matchingDogId: string = match.match;
    return matchingDogId ? matchingDogId : undefined;
  } catch (error) {
    console.error('Error:', error);
  }
}

const apiDogs = {
  generateMatch,
  getBreeds,
  searchDogs
};

export default apiDogs;
