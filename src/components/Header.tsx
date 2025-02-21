import React from 'react';
import { useNavigate } from 'react-router-dom';

/* Interfaces */
import HeaderProps from '../interfaces/HeaderProps';

/* Constants */
import stringValues from '../constants/string-values';

function Header(props: HeaderProps ): React.JSX.Element {
  const navigate = useNavigate();
  const {
    routes: { routeHome },
    urls: { urlPupperlandReadMe, urlAuthLogout }
  } = stringValues;

  async function logOut(): Promise<void> {
    try {
      const response: Response = await fetch(urlAuthLogout, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log(`Successfull logout, status ${response.status}:`, response);
      props.onUpdateIsUserAuthenticated(false);
      navigate(routeHome);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <header>
      <span className="header-title">
        Pupperland
      </span>
      <span className="header-actions-container">
        <span className="header-link-container">
          <a href={urlPupperlandReadMe} target="_blank">Read Me</a>
        </span>
        {
          props.isUserAuthenticated ?
          <button onClick={logOut} className="button-primary button-authentication">
            Log out
          </button> :
          null
        }
      </span>
    </header>
  );
}

export default Header;
