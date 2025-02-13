import React from 'react';

/* Constants */
import stringValues from '../constants/string-values';

function Search(): React.JSX.Element {
  const { urls: { urlBreeds } } = stringValues;

  async function getBreeds() {
    try {
      const response = await fetch(urlBreeds, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Data:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="search">
      <button onClick={getBreeds}>
        Get Breeds
      </button>
    </div>
  );
}

export default Search;
