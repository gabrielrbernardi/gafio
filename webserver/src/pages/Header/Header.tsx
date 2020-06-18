import React, { useState } from 'react';
import {useHistory, Link} from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import {MdPersonOutline} from 'react-icons/md';
import { useCookies } from 'react-cookie';

import '../Home/Home.css';

const Header = () => {
    const history = useHistory();
    const [cookie, setCookie] = useState();
    const [cookies, setCookies, removeCookie] = useCookies([]);
    
    function handleBackButton(){
        history.goBack();
    }

    function getUserData(){
        const cookieData = cookies;
        console.log(cookies);
    }

    return(
        <div onLoad={getUserData}>
            <div className="container-fluid m-0 p-0">
                <nav className="navbar navbar-expand-sm header-background navbar-dark">
                <a href="/" className="navbar-brand cursor-pointer text-small">GAFio</a>
                <div className="ml-auto text-dark">
                    <Link to="myProfile">
                        <div className="h6 text-decoration-none">
                            {/* <strong>{userName}</strong> */}
                            <MdPersonOutline className="ml-2 text-decoration-none" size={30} />
                        </div>
                    </Link>
                    {/* <a className="navbar-brand cursor-pointer ml-auto text-dark">teste</a> */}
                </div>
                </nav>
            </div>
            <button className="btn" onClick={handleBackButton}>
                <FiArrowLeft size={20} />
            </button>
        </div>
    )
}

export default Header;