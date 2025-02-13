import { useState } from 'react'

/* Components */
import Header from './components/Header';
import Login from './components/Login'
import Search from './components/Search';

/* Styles */
import './App.css'

function App() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  return (
    <>
      <Header
        onUpdateIsUserAuthenticated={setIsUserAuthenticated}
        isUserAuthenticated={isUserAuthenticated}
      />
      {
        isUserAuthenticated ?
        <Search /> :
        <Login onUpdateIsUserAuthenticated={setIsUserAuthenticated}/>
      }
    </>
  )
}

export default App
