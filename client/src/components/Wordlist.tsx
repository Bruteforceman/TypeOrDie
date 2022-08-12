import data from "./Data";
import Word from "./Word";
import { useState, useEffect } from 'react';

interface FuncProps {
    handleNextWord(arg : string) : void
} 

const Wordlist = (fprop: FuncProps): JSX.Element => {

    const [ currArray, setArray ] = useState(data);

    useEffect(() => {
        document.body.addEventListener('keydown', handlekey, true);
        return () => {
            document.body.removeEventListener('keydown', handlekey, true);
        }
    })

    function handlekey(e: any){
        if(e.key==="Enter"){
            fprop.handleNextWord(currArray[0]);
            setArray(currArray.slice(1));
        }
    }

    return (
        <>
            {data.map((word) => 
                <Word str={word} />
            )}
        </>
    )
}

export default Wordlist;
