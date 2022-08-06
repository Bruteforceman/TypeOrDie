import data from "./data";
import Word from "./word";

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