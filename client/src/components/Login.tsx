import { useState } from "react";
import { FormEvent } from "react"
import { UserProp } from "../types";
import { post, updateUser } from "../utilities";

export default function Login(props : UserProp): JSX.Element {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const setUser = props.setUser;

    const handleSubmit = (event : FormEvent) => {
        event.preventDefault();
        post('/api/login', {
            'username': username, 
            'password': password
        }).then(data => {
            updateUser(setUser).then(msg => setMessage(msg));
        }).catch(err => console.log(err));
    };
    return (
        <div>
            <p> {message} </p>
            <form onSubmit={handleSubmit}>
                <input name="username" type="text" onChange={e => setUsername(e.target.value)} placeholder="Username" />
                <input name="password" type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
                <input type="submit" value="Login" />
            </form>
        </div>
    )
}