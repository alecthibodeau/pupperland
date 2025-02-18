import React from 'react';

/* Interfaces */
import Dog from '../interfaces/Dog';

function MatchedDog(props: { matchedDog: Dog }): React.JSX.Element {
  const { matchedDog } = props;
  return (
    <div className="matched-dog">
      <h1>{`Your match is ${matchedDog.name} the ${matchedDog.breed}!`}</h1>
      <img
        src={matchedDog.img}
        alt={`${matchedDog.name} the ${matchedDog.breed}`}
        className="matched-dog-image"
      />
      <h2>
        {`${matchedDog.name} is age ${matchedDog.age} and from ${matchedDog.zip_code}.`}
      </h2>
    </div>
  );
}

export default MatchedDog;
