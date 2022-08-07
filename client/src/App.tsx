import React from 'react';
import './App.css';

import Wordlist from './components/Wordlist';

window.addEventListener('keydown', handlekey, true);

function handlekey(e){
  console.log(e);
}

function App() {
  return (
    <div className="App">
      <Wordlist />
    </div>
  );
}

export default App;
