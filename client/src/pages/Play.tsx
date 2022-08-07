import Wordlist from "../components/Wordlist";

window.addEventListener('keydown', handlekey, true);

function handlekey(e: any){
  console.log(e);
}

function Play() : JSX.Element {
    return <Wordlist />
}

export default Play;
