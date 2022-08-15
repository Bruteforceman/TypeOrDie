import { Link } from 'react-router-dom';
import Background from '../components/Background';
import "./Home.css";

function Home() : JSX.Element {
    return (
        <>
            <Background />
            <div className="bar">
                <h3><Link to='/authenticate'> Register </Link></h3>
                <h3><Link to='/authenticate'> Login </Link></h3>
                <h3><Link to='/canvas'> Play </Link></h3>
            </div>
            <img src={process.env.PUBLIC_URL+"explosion.gif"} alt="explosion" width={400} />
            <div className="title">
                <h1> TypeOrDie </h1>
            </div>               
        </>
    );
}

export default Home;
