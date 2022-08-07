import { FC } from "react";

import "./Word.css"

interface Something {
    str: string
}

const Word: FC<Something> = (prop): JSX.Element => {
    return <>
        <h2>{prop.str}</h2>
    </>
}

export default Word;