/* Constants */
import stringValues from '../constants/string-values';

const { urls: { urlDogsBreeds } } = stringValues;

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

const apiDogs = {
  getBreeds
};

export default apiDogs;
