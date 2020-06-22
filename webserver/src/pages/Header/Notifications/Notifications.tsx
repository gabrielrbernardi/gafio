import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import api from '../../../services/api';

const Notifications = () => {
    const [cookies, setCookies] = useCookies([]);
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        document.title = 'GAFio | Notificações';
        let CodUsuario = cookies.userData.CodUsuario
        api.get(`notifications/id/${CodUsuario}`).then(response => {
            const responseList = response.data;
            // console.log(responseList)
            console.log(response.data)
            for( let i = 0; i < response.data.notificationList.length; i++){
                console.log(response.data.notificationList[i].CodNotificacao)
                setNotifications([...notifications, response.data.notificationList[i]])
            }
            // setNotifications()
            // setNotifications(response.data.data[1]["CodNotificacao"]);
            // console.log(response.data.data)
        })
    }, []);
    
    return (
        <div className="row m-5">
            <div className="card shadow-lg mx-auto p-3 col-sm-8 offset-md-3 border">
                <p className="text-center h3">Notificações</p>
                {
                    notifications.map((notification) => (
                        <div key={notification.CodUsuario}>{notification.CodNotificacao}</div>
                    ))
                }
            </div>
        </div>
    )
}

export default Notifications;