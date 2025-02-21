import React, { useState } from 'react';

/* Components */
import Loader from './Loader';

/* Interfaces */
import LoginProps from '../interfaces/LoginProps';

/* Constants */
import stringValues from '../constants/string-values';

function Login(props: LoginProps): React.JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isNameValid, setIsNameValid] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { urls: { urlAuthLogin } } = stringValues;
  const validEmailAddress: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function logIn(): Promise<void> {
    setIsLoading(true);
    try {
      const response: Response = await fetch(urlAuthLogin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email }),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      props.onUpdateIsUserAuthenticated(true);
      props.onUpdateUserName(name);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function handleChangeName(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target) setName(event.target.value);
  }

  function handleChangeEmail(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target) setEmail(event.target.value);
  }

  function OnClickButtonLogin(): void {
    const isEmailTestValid: boolean = validEmailAddress.test(email);
    const isNameNotEmptyString: boolean = (name !== '');
    if (isEmailTestValid && isNameNotEmptyString) {
      logIn();
    } else {
      setIsEmailValid(isEmailTestValid);
      setIsNameValid(isNameNotEmptyString);
    }
  }

  return (
    <>
      {isLoading ? <Loader /> : null}
      <div className="login-container">
        <div className="login">
          <div className="login-fields">
            <input
              type="text"
              placeholder="Name"
              value={name}
              maxLength={50}
              onChange={handleChangeName}
            />
            <input
              type="text"
              placeholder="Email"
              value={email}
              maxLength={50}
              onChange={handleChangeEmail}
            />
          </div>
          <button
            onClick={OnClickButtonLogin}
            className="button-primary button-authentication button-login"
          >
            Log In
          </button>
          {
            !isNameValid || !isEmailValid ?
            <div className="validation-message-container">
              {
                !isNameValid ?
                <div className="validation-message">
                  Enter a valid name.
                </div> :
                null
              }
              {
                !isEmailValid ?
                <div className="validation-message">
                  Enter a valid email.
                </div> :
                null
              }
            </div> :
            null
          }
        </div>
      </div>
    </>
  );
}

export default Login;
