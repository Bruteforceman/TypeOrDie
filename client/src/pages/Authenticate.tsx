import Login from "../components/Login";
import Logout from "../components/Logout";
import Register from "../components/Register";
import { UserProp } from "../types";


export default function AuthenticatePage(props : UserProp) : JSX.Element {
    const { user, setUser } = props; 
    return (
        <div>
            <p>Current user: { user !== null ? user.username : "none" } </p>
            <Login user={user} setUser={setUser}/>
            <Register user={user} setUser={setUser} />
            <Logout user={user} setUser={setUser} />
        </div>
    )
}