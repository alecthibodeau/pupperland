import React from 'react';

/* Constants */
import stringValues from '../constants/string-values';
import svgPaths from '../constants/svg-paths';

function Checkmark(): React.JSX.Element {
  const { hexColors: { colorApplicationLight } } = stringValues;
  return (
    <div className="checkmark-container">
      <div className="checkmark-background">
        <svg
          aria-labelledby="checkmark icon"
          width="28"
          height="28"
          viewBox="-35 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
          fill={colorApplicationLight}
        >
          <polygon points={svgPaths.checkmark} />
        </svg>
      </div>
    </div>
  );
}

export default Checkmark;
