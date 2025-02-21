import React, { useEffect, useState }  from 'react';
import { useNavigate } from 'react-router-dom';

/* Interfaces */
import Dog from '../interfaces/Dog';
import Location from '../interfaces/Location';

/* Constants */
import stringValues from '../constants/string-values';

/* Helpers */
import apiLocations from '../helpers/api-locations';

function DogMatch(props: { matchedDog: Dog | null }): React.JSX.Element {
  const [matchedDogLocation, setMatchedDogLocation] = useState<Location | null>(null);
  const navigate = useNavigate();
  const { matchedDog } = props;
  const { routes: { routeHome } } = stringValues;

  const formattedLocation: string | undefined = matchedDogLocation ?
    `${matchedDogLocation.city}, ${matchedDogLocation.state}` :
    matchedDog?.zip_code
  ;

  useEffect(() => {
    if (matchedDog) {
      window.scrollTo(0, 0);
      (async (): Promise<void> => {
        const dogLocation: Location | undefined = await apiLocations.fetchLocation(matchedDog.zip_code);
        if (dogLocation) setMatchedDogLocation(dogLocation);
      })();
    } else {
      navigate(routeHome);
    }
  }, [matchedDog, navigate, routeHome,]);

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
          {`
            ${matchedDog?.name} is from ${formattedLocation}.
            ${matchedDog?.name}'s age is ${matchedDog?.age}.
          `}
        </h2>
      </div>
    </div>
  );
}

export default DogMatch;
