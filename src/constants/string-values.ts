const urlBase = 'https://frontend-take-home-service.fetch.com';
const urlDogs = `${urlBase}/dogs`;

const texts: { [key: string]: string } = {
  textMaximum: 'maximum',
  textMinimum: 'minimum'
}

const urls: { [key: string]: string } = {
  urlDogs: urlDogs,
  urlDogsBreeds: `${urlDogs}/breeds`,
  urlDogsMatch: `${urlDogs}/match`,
  urlDogsSearch: `${urlDogs}/search`,
  urlLogIn: `${urlBase}/auth/login`,
  urlLogOut: `${urlBase}/auth/logout`
}

const stringValues = {
  texts,
  urls
};

export default stringValues;
