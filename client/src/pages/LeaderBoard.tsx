import { get } from "../utilities";
import { useState } from "react";

interface User {
    username: String,
    top_score: Number
}

export default function LeaderBoard() : JSX.Element {

    const [ users, setusers ] = useState([] as Array<User>);
    get("/api/gettop").then(res => {  
        setusers(res);
    });
    return <>
        {users.map((user) => <><h2>{user.username} scored </h2>{user.top_score !== undefined && <h2>{user.top_score.toString()}</h2>}  </>)}
    </>
}