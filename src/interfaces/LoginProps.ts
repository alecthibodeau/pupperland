interface LoginProps {
  onUpdateIsUserAuthenticated: (isUserLoggedIn: boolean) => void;
  onUpdateUserName: (userName: string) => void;
}

export default LoginProps;
