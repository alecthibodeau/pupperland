const urlBase = 'https://frontend-take-home-service.fetch.com';
const urlDogs = `${urlBase}/dogs`;
const ages: string[] = Array.from({ length: 16 }, (_, index) => (index).toString());

const selectOptions: { [key: string]: string[] } = {
  ages
}

const texts: { [key: string]: string } = {
  textChoose: 'Search for puppers by choosing your preferences below, or just click Search Dogs now to view a bunch of puppers!',
  textSorry: 'Sorry! No dogs found with your preferences. Try again.',
  textMaximum: 'maximum',
  textMinimum: 'minimum'
}

const urls: { [key: string]: string } = {
  urlDogs: urlDogs,
  urlDogsBreeds: `${urlDogs}/breeds`,
  urlDogsMatch: `${urlDogs}/match`,
  urlDogsSearch: `${urlDogs}/search`,
  urlAuthLogin: `${urlBase}/auth/login`,
  urlAuthLogout: `${urlBase}/auth/logout`
}

const stringValues = {
  selectOptions,
  texts,
  urls
};

export default stringValues;
