import React from 'react';
import { Link } from 'react-router-dom';
import { RiLoginBoxLine } from 'react-icons/ri';
import { IoIosCreate } from 'react-icons/io';

const Root = () => {
    return (
        // <div className="card-columns m-5 p-3">
        <div className="card mt-5 mx-auto col-sm-10 text-center text-decoration-none">
            <h2>Root Page</h2>
            <Link to="/login">
                <RiLoginBoxLine className="mt-3 mb-3 ml-auto mr-auto" size={40} />
                <p className="h6">Login</p>
            </Link>
            <Link to="/signup">
                <IoIosCreate className="mt-3 mb-3 ml-auto mr-auto" size={40} />
                <p className="h6">Sign Up</p>
            </Link>
        </div>

        // </div>
    )
}

export default Root;