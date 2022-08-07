import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import About from './pages/About';

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
      </Routes>
    </div>
  );
}

export default App;
