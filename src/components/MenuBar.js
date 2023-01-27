import {Link} from "react-router-dom";

function MenuBar() {
    return (
        <div id="menu-bar">
            <span>
                <Link to={`${process.env.PUBLIC_URL}/`}>Home</Link>
            </span>
            <span> | </span>
            <span>
                <Link to={`${process.env.PUBLIC_URL}/Test`}>test</Link>
            </span>
        </div>
    );
}

export default MenuBar;