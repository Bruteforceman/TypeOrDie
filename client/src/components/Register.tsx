import { FormEvent, useState } from "react"
import { UserProp } from "../types";
import { post, updateUser } from "../utilities";
import "./Form.css"

export default function Register(props : UserProp) : JSX.Element {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [message, setMessage] = useState('');
    const setUser = props.setUser;

    const handleSubmit = (e : FormEvent) => {
        e.preventDefault();
        if(password === password2) {
            post('/api/register', {
                'username': username,
                'email': email,
                'password': password,
                'top_score': 0
            }).then(data => {
                const success = data.success as boolean;
                if(success) {
                    // TODO: route to home page
                    updateUser(setUser);
                    setMessage(data.message as string);
                } else {
                    setMessage(data.message as string);
                }
            }).catch(err => setMessage(err as string));
        } else {
            setMessage(`Passwords don't match`);
        }
    }

    return (
        <div className="form-container">
            <p>{message}</p>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
                <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                <input type="password" placeholder="Confirm password" onChange={e => setPassword2(e.target.value)} />
                <input type="submit" value="Register" />
            </form>            
        </div>
    )
}