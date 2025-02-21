import React from 'react';

/* Constants */
import stringValues from '../constants/string-values';

function Footer(): React.JSX.Element {
  const { urls: { urlPortfolio } } = stringValues;

  return (
    <footer>
      <span>
        <a href={urlPortfolio}>Alec Thibodeau</a>, {new Date().getFullYear()}
      </span>
    </footer>
  );
}

export default Footer;
