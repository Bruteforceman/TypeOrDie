import { FC } from "react";

interface Something {
    str: string
}

const Word: FC<Something> = (prop): JSX.Element => {
    return <>
        {prop.str};
    </>
}


export default Word;