import React from 'react';

/* Interfaces */
import HeaderProps from '../interfaces/HeaderProps';

/* Constants */
import stringValues from '../constants/string-values';

function Header(props: HeaderProps ): React.JSX.Element {
  const { urls: { urlLogOut } } = stringValues;

  async function logOut(): Promise<void> {
    try {
      const response = await fetch(urlLogOut, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Success:', response);
      props.onUpdateIsUserAuthenticated(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <header>
      {
        props.isUserAuthenticated ?
        <button onClick={logOut}>
          Log Out
        </button> :
        <div>
          Log in
        </div>
      }
    </header>
  );
}

export default Header;
