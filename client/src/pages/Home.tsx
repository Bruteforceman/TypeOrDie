import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Background from '../components/Background';
import Login from '../components/Login';
import Register from '../components/Register';
import { UserProp } from '../types';
import "./Home.css";

function Home(prop : UserProp) : JSX.Element {
    useEffect(() => {
        const func = () => {
            hide('login-form');
            hide('register-form');
        }
        window.addEventListener("click", func);
        return () => {
            window.removeEventListener("click", func);
        }
    }, []);

    const { user, setUser } = prop; 
    const show = (id : string) => {
        const el = document.getElementById(id);
        if(el !== null) {
            el.style.display = 'initial';
        }
    }
    const hide = (id : string) => {
        const el = document.getElementById(id);
        if(el !== null) {
            el.style.display = 'none';
        }
    }
    return (
        <>
            <Background />
            <div className="bar">
                <h3><Link to='/' onClick={(event) => { event.stopPropagation(); hide('login-form'); show('register-form') }}> Register </Link></h3>
                <h3><Link to='/' onClick={(event) => { event.stopPropagation(); hide('register-form'); show('login-form') }}> Login </Link></h3>
                <h3><Link to='/canvas'> Play </Link></h3>
            </div>
            <img src={process.env.PUBLIC_URL+"explosion.gif"} alt="explosion" width={400} className="explosion"/>
            <div className="title">
                <h1> TypeOrDie </h1>
            </div>      
            <div id="login-form" onClick={(event) => { event.stopPropagation() }}><Login user={user} setUser={setUser}/></div>
            <div id="register-form" onClick={(event) => { event.stopPropagation() }}><Register user={user} setUser={setUser} /></div>         
        </>
    );
}

export default Home;
