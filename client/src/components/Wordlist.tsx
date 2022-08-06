import data from "./data";
import Word from "./Word";

function Wordlist(){
    return (
        <>
            {data.map((word) => 
                <Word str={word} />
            )}
        </>
    )
}

export default Wordlist;