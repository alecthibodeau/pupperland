import React, { useEffect }  from 'react';
import { useNavigate } from 'react-router-dom';

/* Interfaces */
import Dog from '../interfaces/Dog';

/* Constants */
import stringValues from '../constants/string-values';

function DogMatch(props: { matchedDog: Dog | null }): React.JSX.Element {
  const navigate = useNavigate();
  const { matchedDog } = props;
  const { routes: { routeHome } } = stringValues;

  useEffect(() => {
    if (matchedDog) {
      window.scrollTo(0, 0);
    } else {
      navigate(routeHome);
    }
  }, [matchedDog, navigate, routeHome]);

  function onClickButtonNewSearch(): void {
    navigate(routeHome);
  }

  return (
    <div className="dog-match">
      <div className="new-search-container">
       <button onClick={onClickButtonNewSearch} className="button-secondary">
         New Search
       </button>
      </div>
      <div className="dog-match-info">
        <h1>{`Your match is ${matchedDog?.name} the ${matchedDog?.breed}!`}</h1>
        <img
          src={matchedDog?.img}
          alt={`${matchedDog?.name} the ${matchedDog?.breed}`}
          className="dog-match-image"
        />
        <h2>
          {`${matchedDog?.name} is age ${matchedDog?.age} and from ${matchedDog?.zip_code}.`}
        </h2>
      </div>
    </div>
  );
}

export default DogMatch;
