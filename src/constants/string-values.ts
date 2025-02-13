const baseUrl = 'https://frontend-take-home-service.fetch.com';

const urls: { [key: string]: string } = {
  urlBreeds: `${baseUrl}/dogs/breeds`,
  urlLogIn: `${baseUrl}/auth/login`,
  urlLogOut: `${baseUrl}/auth/logout`
}

const stringValues = {
  urls
};

export default stringValues;
