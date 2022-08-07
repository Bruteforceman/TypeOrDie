import "./Word.css"

interface Prop {
    str: string
}

const Word = (prop: Prop): JSX.Element => {
    return <>
        <h2>{prop.str}</h2>
    </>
}

export default Word;