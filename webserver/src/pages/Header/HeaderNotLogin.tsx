import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import { useCookies } from 'react-cookie';

import logo from '../../assets/logoFiocruz.png';
import api from '../../services/api';
import ToastComponent from '../../components/Toast';

const Header = () => {
    const history = useHistory();
    const [cookies] = useCookies([]);
    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');
    
    useEffect(() => {
        if(cookies.userData){
            history.push('/home');
        }
    }, [cookies.userData, history]);

    useEffect(() => {
        api.get('/serverStatus').then(response => {
            if(!response.data.serverRunning){
                showToast('error', 'Erro na conexão!', response.data.error + '\nErro: ' + String(response.data.errorType.code))
            }
        })
    }, [])

    function showToast(messageType: string, messageTitle: string, messageContent: string){
        setToast(false)
        setMessageType(messageType);
        setMessageTitle(messageTitle);
        setMessageContent(messageContent);
        setToast(true);
        setTimeout(() => {
            setToast(false);
        }, 4500)
    }

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
            {getToast &&
                <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent}/>
            }
        </div>
    )
}

export default Header;