import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { MdPersonOutline, MdNotificationsNone } from 'react-icons/md';
import { useCookies } from 'react-cookie';
import { Dropdown, Button, Badge } from 'react-bootstrap';

import '../Home/Home.css';

import api from '../../services/api';

const Header = () => {
    const history = useHistory();
    const [cookies, setCookies, removeCookie] = useCookies([]);
    const [userName, setUserName] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [notificationsLength, setNotificationsLength] = useState(Number);
    
    function handleBackButton(){
        history.goBack();
    }

    useEffect(() => {
        if(!cookies.userData){
            history.push('/login');
            alert('Faça login para acessar o conteúdo')
            return
        }else{
            const cookie = cookies.userData;
            setUserName(cookie.Nome);
            setTipoUsuario(cookie.TipoUsuario)
        }
    }, [cookies, history]);

    useEffect(() => {
        const cookie = cookies.userData;
        const CodUsuario = cookie.CodUsuario;
        const TipoUsuario = cookie.TipoUsuario;
        console.log(CodUsuario)
        console.log(TipoUsuario)
        api.post(`notifications/id/${CodUsuario}`, {TipoUsuario: TipoUsuario}).then(response => {
            console.log(response)
            setNotificationsLength(response.data.length)
        })
        // let CodUsuario = cookies.userData.CodUsuario;
        // let TipoUsuario = cookies.userData.TipoUsuario;
        // console.log(cookies.notificationLength);
        // setNotificationsLength(cookies.notificationLength.length);
    }, [])

    function logoutFunction(){
        removeCookie('userData');
        removeCookie('notificationLength');
        history.push('/login');
    }

    function myProfile(){
        history.push('/myProfile');
    }

    function toNotifications(){
        history.push('/notifications');
    }

    function toHome(){
        history.push('/home');
    }
    function toUsers(){
        history.push('/users');
    }

    return(
        <div>
            <title>teste</title>
            <div className="container-fluid m-0 p-0">
                <nav className="navbar navbar-expand-sm header-background navbar-dark">
                    {/* <Link to="/home"> */}
                        <p onClick={toHome} className="navbar-brand m-0 cursor-pointer text-small">GAFio</p>
                    {/* </Link> */}
                    <div className="ml-auto text-dark">
                    </div>
                    <div className="ml-auto text-dark">
                        <Button onClick={toNotifications} variant="outline-dark">
                            <p className="d-inline">Notificações</p>
                            <MdNotificationsNone className="ml-2" size={30}/>
                            {
                                notificationsLength > 0
                                ? 
                                    <Badge variant="danger">{notificationsLength}</Badge>
                                :
                                    // <Badge variant="secondary">{notificationsLength}</Badge>
                                    <></>
                            }
                            
                        </Button>
                        <Dropdown className="ml-2 d-inline">
                            <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                                <strong className="text-capitalize">{userName}</strong>
                                
                                <MdPersonOutline className="ml-2" size={30} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={myProfile}>Gerenciar sua conta</Dropdown.Item>
                                {tipoUsuario === 'A'
                                    ? <Dropdown.Item className="bg-secondary-custom" onClick={toUsers}>Gerenciar usuários</Dropdown.Item>
                                    : <></>
                                }
                                <Dropdown.Divider />
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