import { Dispatch, SetStateAction } from 'react';

interface HeaderProps {
  isUserAuthenticated: boolean;
  onUpdateIsUserAuthenticated: Dispatch<SetStateAction<boolean>>;
}

export default HeaderProps;
