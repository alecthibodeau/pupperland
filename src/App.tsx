import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

/* Components */
import DogMatch from './components/DogMatch';
import DogsSearch from './components/DogsSearch';
import Footer from './components/Footer';
import Header from './components/Header';
import Login from './components/Login'

/* Interfaces */
import Dog from './interfaces/Dog';

/* Constants */
import stringValues from './constants/string-values';

function App() {
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(false);
  const [userName, setIsUserName] = useState<string>('');
  const { routes: { routeHome, routeMatch } } = stringValues;

  return (
    <BrowserRouter>
      <Header
        isUserAuthenticated={isUserAuthenticated}
        onUpdateIsUserAuthenticated={setIsUserAuthenticated}
      />
      <main>
        <Routes>
          <Route path={routeHome} element={
            isUserAuthenticated ?
            <DogsSearch
              userName={userName}
              onUpdateMatchedDog={setMatchedDog}
            /> :
            <Login
              onUpdateIsUserAuthenticated={setIsUserAuthenticated}
              onUpdateUserName={setIsUserName}
            />
          } />
          <Route path={routeMatch} element={<DogMatch matchedDog={matchedDog} />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App
