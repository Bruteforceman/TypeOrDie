import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import Play from './pages/Play';

window.addEventListener('keydown', handlekey, true);

function handlekey(e: any){
  console.log(e);
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={ <Home/> } />
        <Route path='about' element={ <About /> } />
        <Route path='play' element={ <Play /> } />
      </Routes>
    </div>
  );
}

export default App;
