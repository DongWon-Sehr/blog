import {Link} from "react-router-dom";

function MenuBar() {
    return (
        <div id="menu-bar">
            <Link to={`${process.env.PUBLIC_URL}/`}>Home</Link>
        </div>
    );
}

export default MenuBar;