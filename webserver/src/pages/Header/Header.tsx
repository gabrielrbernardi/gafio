import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { MdPersonOutline, MdNotificationsNone } from 'react-icons/md';
import { useCookies } from 'react-cookie';
import { Dropdown } from 'react-bootstrap';

import '../Home/Home.css';

const Header = () => {
    const history = useHistory();
    const [cookies, setCookies, removeCookie] = useCookies([]);
    const [userName, setUserName] = useState('');
    
    function handleBackButton(){
        history.goBack();
    }

    useEffect(() => {
        if(!cookies.userData){
            return
        }else{
            const cookie = String(cookies.userData.Nome);
            setUserName(cookie);
        }
    }, [cookies]);

    function logoutFunction(){
        removeCookie('userData');
        history.push('/login');
    }

    function myProfile(){
        history.push('/myProfile');
    }

    return(
        <div>
            <div className="container-fluid m-0 p-0">
                <nav className="navbar navbar-expand-sm header-background navbar-dark">
                    <a href="/" className="navbar-brand cursor-pointer text-small">GAFio</a>
                    <div className="ml-auto text-dark">
                    </div>
                    <div className="ml-auto text-dark">
                        <Link to="/notifications" className="d-inline text-dark">
                            <p className="d-inline">Notificações</p>
                            <MdNotificationsNone className="m-2" size={30}/>
                        </Link>
                        <Dropdown className="d-inline">
                            <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                                <strong>{userName}</strong>
                                
                                <MdPersonOutline className="ml-2 text-decoration-none" size={30} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={myProfile}>Gerenciar sua conta</Dropdown.Item>
                                <Dropdown.Item onClick={logoutFunction}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
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