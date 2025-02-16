import React, { useState } from 'react';
/* Interfaces */
import LoginProps from '../interfaces/LoginProps';

/* Constants */
import stringValues from '../constants/string-values';

function Login(props: LoginProps): React.JSX.Element {
  const [email, setEmail] = useState<string>('potato@website.com');
  const [name, setName] = useState<string>('potato');
  const { urls: { urlLogIn } } = stringValues;

  async function logIn(): Promise<void> {
    try {
      const response: Response = await fetch(urlLogIn, {
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
      console.log(`Successfull login, status ${response.status}:`, response);
      props.onUpdateIsUserAuthenticated(true);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className="login">
      <div className="login-fields">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target) setName(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target) setEmail(event.target.value);
          }}
        />
      </div>
      <button
        onClick={logIn}
        className="button-primary button-authentication button-login"
      >
        Log In
      </button>
    </div>
  );
}

export default Login;
