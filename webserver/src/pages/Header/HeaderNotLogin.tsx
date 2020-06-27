import React, { useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import { useCookies } from 'react-cookie';

import logo from '../../assets/logoFiocruz.png';

const Header = () => {
    const history = useHistory();
    const [cookies] = useCookies([]);
    
    useEffect(() => {
        if(cookies.userData){
            history.push('/home');
        }
    }, [cookies.userData, history]);

    function handleBackButton(){
        history.goBack();
    }

    return(
        <div>
            <div className="container-fluid m-0 p-0">
                <nav className="navbar navbar-expand-sm header-background navbar-dark">
                <a href="/" className="navbar-brand cursor-pointer text-big">GAFio</a>
                <a href="/" className="navbar-brand cursor-pointer ml-auto"> 
                    <img src={logo} alt="logo" className="logo"/>
                </a>
                </nav>
            </div>
            <button className="btn" onClick={handleBackButton}>
                <FiArrowLeft size={20} />
            </button>
        </div>
    )
}

export default Header;