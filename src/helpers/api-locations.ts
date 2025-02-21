/* Interfaces */
import Location from '../interfaces/Location';

/* Constants */
import stringValues from '../constants/string-values';

const {
  networkMessages: { textResponseNotOkay },
  urls: { urlLocations }
} = stringValues;

async function fetchLocation(zipCode: string): Promise<Location | undefined> {
  const zipCodes: string[] = [zipCode];
  try {
    const response: Response = await fetch(urlLocations, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zipCodes),
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(textResponseNotOkay);
    }
    const dogLocations: Location[] = await response.json();
    const dogLocation: Location = dogLocations[0];
    return dogLocation ? dogLocation : undefined;
  } catch (error) {
    console.error(error);
  }
}

const apiLocations = {
  fetchLocation
};

export default apiLocations;
