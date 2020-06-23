import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import api from '../../../services/api';

const Notifications = () => {
    const [cookies] = useCookies([]);
    const [getNotifications, setNotifications] = useState<any[]>([]);
    const [responseDataStatus, setResponseDataStatus] = useState(Number);
    const [responseData, setResponseData] = useState('');

    useEffect(() => {
        document.title = 'GAFio | Notificações';
        getNotificationFunction();
    }, [cookies.userData.CodUsuario]);
    
    function getNotificationFunction(){
        let CodUsuario = cookies.userData.CodUsuario
        api.get(`notifications/id/${CodUsuario}`).then(response => {
            setNotifications([])
            const responseList = response.data;
            if(response.data.notificationFound){
                for( let i = 0; i < responseList.notifications[0].length; i++){
                    // console.log(responseList.notifications[0].length)
                    setNotifications(notification => ([...notification, responseList.notifications[0][i] ]))
                }
            }
        })
    }

    function accept(NotificationId: Number){
        api.put(`notifications/status/accept/${NotificationId}`).then(response => {
            if(response.data.updatedStatusNotification){
                getNotificationFunction();
                setResponseDataStatus(1);
                setResponseData("Notificação alterada com sucesso.");
            }else{
                setResponseDataStatus(2);
                setResponseData("Não foi possível alterar a notificação.");
            }
        });
    }

    function refuse(NotificationId: Number){
        api.put(`notifications/status/refuse/${NotificationId}`).then(response => {
            if(response.data.updatedStatusNotification){
                getNotificationFunction();
                setResponseDataStatus(1);
                setResponseData("Notificação alterada com sucesso.");
            }else{
                setResponseDataStatus(2);
                setResponseData("Não foi possível alterar a notificação.");
            }
        });
    }
    
    return (
        <>
            <div className="row m-5">
                    {responseDataStatus === 0
                        ? <></>
                        : responseDataStatus === 1 
                            ?
                            <div className="card shadow-lg mb-4 mx-auto col-sm-8 offset-md-3 border">
                                <div className="alert alert-success m-0 p-3 alert-dismissible fade show">
                                    {responseData}
                                </div>
                            </div>
                            :
                            <div className="card shadow-lg mb-4 mx-auto col-sm-8 offset-md-3 border">
                                <div className="alert alert-danger alert-dismissible fade show">
                                    {responseData}
                                </div>
                            </div>
                    }
                
                <div className="card shadow-lg mb-4 mx-auto p-3 col-sm-8 offset-md-3 border">
                    <p className="text-center h3">Notificações</p>
                </div>
                    {getNotifications.length > 0
                        ? getNotifications.map((notification) => (
                            <div key={notification.CodNotificacao} className="card shadow-lg mb-4 mx-auto p-3 col-sm-8">
                                <p className="h5">{notification.Descricao}</p>
                                <p className="btn btn-success" onClick={() => accept(notification.CodNotificacao)} role="button">Aceitar</p>
                                <p className="btn btn-outline-danger" onClick={() => refuse(notification.CodNotificacao)} role="button">Recusar</p>
                            </div>
                        ))
                        :
                            <div className="card shadow-lg mb-4 mx-auto p-3 col-sm-8">
                                <p className="text-center h5">Não há notificações</p>
                            </div>
                    }
                {
                }
            </div>
        </>
    )
}

export default Notifications;