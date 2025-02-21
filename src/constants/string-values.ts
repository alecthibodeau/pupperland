const urlBase = 'https://frontend-take-home-service.fetch.com';
const urlDogs = `${urlBase}/dogs`;
const ages: string[] = Array.from({ length: 16 }, (_, index) => (index).toString());

const characters: { [key: string]: string } = {
  greaterThan: '>',
  lessThan: '<',
  doubleGreaterThan: '>>',
  doubleLessThan: '<<'
}

const hexColors: { [key: string]: string } = {
  colorApplicationLight: '#f5f5f5'
}

const networkMessages: { [key: string]: string } = {
  textResponseNotOkay: 'Network response was not ok.'
}

const selectOptions: { [key: string]: string[] } = {
  ages
}

const texts: { [key: string]: string } = {
  textChoose: 'Choose your preferences to search for lovable puppers (shelter dogs looking to match with a new home). Or just click Search Dogs now to view a bunch of puppers!',
  textSorry: 'Sorry! No dogs found with your preferences. Try again.',
  textLeft: 'left',
  textRight: 'right',
  textMaximum: 'maximum',
  textMinimum: 'minimum'
}

const urls: { [key: string]: string } = {
  urlAuthLogin: `${urlBase}/auth/login`,
  urlAuthLogout: `${urlBase}/auth/logout`,
  urlDogs: urlDogs,
  urlDogsBreeds: `${urlDogs}/breeds`,
  urlDogsMatch: `${urlDogs}/match`,
  urlDogsSearch: `${urlDogs}/search`,
  urlPortfolio: 'https://alect.me',
  urlPupperlandReadMe: 'https://github.com/alecthibodeau/pupperland/blob/main/README.md#pupperland'
}

const stringValues = {
  characters,
  hexColors,
  networkMessages,
  selectOptions,
  texts,
  urls
};

export default stringValues;
