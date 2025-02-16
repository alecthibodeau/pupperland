import React from 'react';

/* Interfaces */
import HeaderProps from '../interfaces/HeaderProps';

/* Constants */
import stringValues from '../constants/string-values';

function Header(props: HeaderProps ): React.JSX.Element {
  const { urls: { urlLogOut } } = stringValues;

  async function logOut(): Promise<void> {
    try {
      const response: Response = await fetch(urlLogOut, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log(`Successfull logout, status ${response.status}:`, response);
      props.onUpdateIsUserAuthenticated(false);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <header>
      <span className="header-title">
        Pupperland
      </span>
      {
        props.isUserAuthenticated ?
        <button
          onClick={logOut}
          className="button-primary button-authentication"
        >
          Log out
        </button> :
        null
      }
    </header>
  );
}

export default Header;
