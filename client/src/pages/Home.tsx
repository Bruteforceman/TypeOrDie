import { Link } from 'react-router-dom';
import Background from '../components/Background';
import "./Home.css";

function Home() : JSX.Element {
    return (
        <>
            <Background />
            <div className="bar">
                <h3><Link to='/authenticate'> REGISTER </Link></h3>
                <h3><Link to='/authenticate'> LOGIN </Link></h3>
                <h3><Link to='/canvas'> PLAY </Link></h3>
            </div>
            <div className="title">
                <h1> TypeOrDie </h1>
            </div>               
        </>
    );
}

export default Home;
