import Wordlist from "../components/Wordlist";
import {Routes, Route, useNavigate} from 'react-router-dom';

function PlayButton(): JSX.Element {
    const navigate = useNavigate();
    return (
        <>
            <h1> Welcome to TypeOrDie </h1>

            <button className="playButton" 
                onClick={() => navigate('/play')}>
             Play!
            </button>
        </>
    );
}

function Home() : JSX.Element {
    return <PlayButton />
}

export default Home;
