import { Link } from 'react-router-dom';

function Header() {
    return (
        <header>
            <h1 className="site-title">Dylan Truong's Dynamic Turtle | ITIS 3135</h1>
            <nav>
                <Link to="/">Home</Link> |
                <Link to="/introduction">Introduction</Link> |
                <Link to="/contract">Contract</Link>
                {/* The rest of the links are omitted as per assignment instructions */}
            </nav>
        </header>
    );
}

export default Header;