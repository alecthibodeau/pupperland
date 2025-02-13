import { Dispatch, SetStateAction } from 'react';

interface LoginProps {
  onUpdateIsUserAuthenticated: Dispatch<SetStateAction<boolean>>;
}

export default LoginProps;
