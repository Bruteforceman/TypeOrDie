import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import Play from './pages/Play';
import CanvasGame from './pages/CanvasGame';
import { useEffect, useState } from 'react';
import { User } from './types';
import { updateUser } from './utilities';
import LeaderBoard from './pages/LeaderBoard';


function App() {
  
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => { updateUser(setUser) }, []);

  // you should pass in the user prop with the component whenever necessary
  // if a component can potentially change the user object, pass in the setUser hook
  // as well. this allows you to change the user object from child components
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={ <Home user={user} setUser={setUser} /> } />
        <Route path='leader' element={ <LeaderBoard /> } />
        <Route path='about' element={ <About /> } />
        <Route path='play' element={ <Play /> } />
        <Route path='canvas' element={ <CanvasGame user={user} setUser={setUser} /> } />
      </Routes>
    </div>
  );
}

export default App;
