import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import api from '../../../services/api';

import {NotificationsService} from './NotificationsService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Button from 'react-bootstrap/Button';

const Notifications = () => {
    const [cookies, setCookies] = useCookies([]);
    const [getNotifications, setNotifications] = useState([]);
    const [responseDataStatus, setResponseDataStatus] = useState(Number);
    const [responseData, setResponseData] = useState('');
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        document.title = 'GAFio | Notificações';
        getNotificationFunction();
    }, []);
    
    // const [cars, setCars] = useState([]);
    const notificationsService = new NotificationsService();

    function getNotificationFunction(){
        if(cookies.userData){
            setNotifications([])
            let CodUsuario = cookies.userData.CodUsuario;
            let TipoUsuario = cookies.userData.TipoUsuario;
            setTimeout(() => {
                notificationsService.getNotifications(CodUsuario, TipoUsuario).then(data => {
                    setNotifications(data.notifications)
                    setLoading(false)
                })
            }, 300)
            // api.post(`notifications/id/${CodUsuario}`, {TipoUsuario: TipoUsuario}).then(response => {
            //     setNotifications([])
            //     console.log(response)
            //     const responseList = response.data;
            //     if(response.data.notificationFound){
            //         // setCookies('notificationLength', {length: response.data.notifications[0].length})
            //         for( let i = 0; i < responseList.notifications[0].length; i++){
            //             setNotifications(notification => ([...notification, responseList.notifications[0][i] ]))
            //         }
            //     }
            // })
        }
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

    const actionTemplate = (rowData: any, column: any) => {
        return (
            <div>
                <Button variant="outline-success" onClick={() => {accept(rowData['CodNotificacao'], rowData['TipoNotificacao'])}}>Aceitar</Button>
                <div className="mr-2 d-inline"></div>
                <Button variant="outline-danger" onClick={() => {refuse(rowData['CodNotificacao'], rowData['TipoNotificacao'])}}>Recusar</Button>
            </div>
        );
    };
    
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
                    ?
                    <DataTable className="col-sm-8 offset-sm-8 mx-auto p-0 shadow-lg" value={getNotifications} responsive={true}
                        resizableColumns={true} loading={loading}>
                        <Column field="CodUsuario" header="Código" style={{width:'10%', textAlign:'center'}}/>
                        <Column field="Descricao" header="Descrição" style={{width:'60%', textAlign:'center'}}/>
                        <Column header="Ações" body={actionTemplate} style={{width:'20%', textAlign:'center'}}/>
                    </DataTable>
                    : 
                    <div className="card shadow-lg mb-4 mx-auto p-3 col-sm-8">
                        <p className="text-center h5">Não há notificações</p>
                    </div>
                }
            </div>
        </>
    )
}

export default Notifications;