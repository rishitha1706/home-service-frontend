import logo from "../assets/homeservice-logo.jpg";

function Logo() {
    return (
        <div className="app-logo">
            <img
                src={logo}
                alt="Home Service"
            />
        </div>
    );
}

export default Logo;