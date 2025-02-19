import { useState } from 'react'

/* Components */
import DogsSearch from './components/DogsSearch';
import Footer from './components/Footer';
import Header from './components/Header';
import Login from './components/Login'

/* Styles */
import './App.css'

function App() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  return (
    <>
      <Header
        isUserAuthenticated={isUserAuthenticated}
        onUpdateIsUserAuthenticated={setIsUserAuthenticated}
      />
      <main>
        {
          isUserAuthenticated ?
          <DogsSearch /> :
          <Login onUpdateIsUserAuthenticated={setIsUserAuthenticated}/>
        }
      </main>
      <Footer />
    </>
  );
}

export default App
