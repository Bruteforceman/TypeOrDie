import Wordlist from "../components/Wordlist";
import { useState } from 'react';
import data from "../components/Data";

function Play() : JSX.Element {

    const [ currWord, setWord ] = useState(data[0]);

    const findNextWord = (arg : string): void => {
        setWord(arg);
    }

    return (
        <>
            <h2>Current word to be typed: {currWord}</h2>
            <Wordlist handleNextWord = {findNextWord}/>
        </>
    )
}


export default Play;
