/* Constants */
import stringValues from '../constants/string-values';
import APISearchDogsProps from '../interfaces/apiSearchDogsProps';

/* Interfaces */
import Dog from '../interfaces/Dog';
import ResultsOfDogsSearch from '../interfaces/ResultsOfDogsSearch';

const {
  urls: { urlDogs, urlDogsBreeds, urlDogsSearch }
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
  const maximumAllowedIds: string[] = resultIds.slice(0, 100);
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
    return fetchedDogs;
  } catch (error) {
    console.error('Error:', error);
  }
}

const apiDogs = {
  getBreeds,
  searchDogs
};

export default apiDogs;
