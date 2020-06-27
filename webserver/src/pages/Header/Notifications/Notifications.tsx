import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import api from '../../../services/api';

const Notifications = () => {
    const [cookies, setCookies] = useCookies([]);
    const [getNotifications, setNotifications] = useState<any[]>([]);
    const [responseDataStatus, setResponseDataStatus] = useState(Number);
    const [responseData, setResponseData] = useState('');

    useEffect(() => {
        document.title = 'GAFio | Notificações';
        getNotificationFunction();
    }, [cookies.userData.CodUsuario]);
    
    function getNotificationFunction(){
        let CodUsuario = cookies.userData.CodUsuario;
        let TipoUsuario = cookies.userData.TipoUsuario;
        api.post(`notifications/id/${CodUsuario}`, {TipoUsuario: TipoUsuario}).then(response => {
            setNotifications([])
            console.log(response)
            const responseList = response.data;
            if(response.data.notificationFound){
                setCookies('notificationLength', {length: response.data.notifications[0].length})
                for( let i = 0; i < responseList.notifications[0].length; i++){
                    setNotifications(notification => ([...notification, responseList.notifications[0][i] ]))
                }
            }
        })
    }

    function accept(NotificationId: Number, tipoNotificacao: string){
        if(tipoNotificacao === "Change"){
            api.put(`notifications/status/accept/${NotificationId}`, {notificationType: tipoNotificacao}).then(response => {
                if(response.data.updatedStatusNotification){
                    getNotificationFunction();
                    setResponseDataStatus(1);
                    setResponseData("Notificação alterada com sucesso.");
                }else{
                    setResponseDataStatus(2);
                    setResponseData("Não foi possível alterar a notificação.");
                }
            });
        }else{
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
    }

    function refuse(NotificationId: Number, tipoNotificacao: string){
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
                                <div className="alert alert-success col-sm-8 m-0 mx-auto mb-4 p-3 alert-dismissible fade show">
                                    {responseData}
                                </div>
                            :
                                <div className="alert alert-danger col-sm-8 m-0 mx-auto mb-4 p-3 alert-dismissible fade show">
                                    {responseData}
                                </div>
                    }
                
                <div className="card shadow-lg mb-4 mx-auto p-3 col-sm-8 offset-md-3 border">
                    <p className="text-center h3">Notificações</p>
                </div>
                    {getNotifications.length > 0
                        ? getNotifications.map((notification) => (
                            notification.TipoNotificacao === "Create"
                                ?
                                <>
                                    <div key={notification.CodNotificacao.toString()} className="card shadow-lg mb-4 mx-auto p-3 col-sm-8">
                                        <p className="h5">{notification.Descricao}</p>
                                        <p className="btn btn-success" onClick={() => accept(notification.CodNotificacao, notification.TipoNotificacao)} role="button">Aceitar</p>
                                        <p className="btn btn-outline-danger" onClick={() => refuse(notification.CodNotificacao, notification.TipoNotificacao)} role="button">Recusar</p>
                                    </div>
                                </>
                                : notification.TipoNotificacao === "Change"
                                    ? 
                                        <>
                                            <div key={notification.CodNotificacao.toString()} className="card shadow-lg mb-4 mx-auto p-3 col-sm-8">
                                                <p className="h5">{notification.Descricao}</p>
                                                <p className="btn btn-success" onClick={() => accept(notification.CodNotificacao, notification.TipoNotificacao)} role="button">Aceitar</p>
                                                <p className="btn btn-outline-danger" onClick={() => refuse(notification.CodNotificacao, notification.TipoNotificacao)} role="button">Recusar</p>
                                            </div>
                                        </>
                                    :
                                    <></>
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