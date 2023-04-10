import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function ModelList({ models }) {
    return (
        <div>
            {models.map((model) =>
                <p id={model.id} key={model.id}>
                    <span className='title'>- {model.id}</span>
                    <br />
                    {/* <Link to={`${process.env.PUBLIC_URL}/models/details/${model.id}`}>more details</Link> */}
                </p>
            )}
        </div>
    );
}

ModelList.propTypes = {
    models: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default ModelList;