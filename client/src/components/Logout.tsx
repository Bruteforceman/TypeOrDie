import { FormEvent, useState } from "react";
import { UserProp } from "../types";
import { post, updateUser } from "../utilities";

export default function Logout(props : UserProp) {
    const [message, setMessage] = useState('');
    const setUser = props.setUser;
    const handleSubmit = (event : FormEvent) => {
        event.preventDefault() // you may network errors without it
        post('/api/logout').then(data => { 
            updateUser(setUser);
            setMessage(data.message as string);
        }).catch(err => { console.log(err) } );
    }
    return (
        <div>
            <p> { message } </p>
            <form onSubmit={handleSubmit}>
                <input type="submit" value="logout" />
            </form>
        </div>
    )
}