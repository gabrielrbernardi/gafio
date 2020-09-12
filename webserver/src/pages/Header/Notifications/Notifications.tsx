import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import api from '../../../services/api';

import {NotificationsService} from './NotificationsService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Button from 'react-bootstrap/Button';
import { start } from 'repl';
import Loading from '../../../components/Loading';

const Notifications = () => {
    const [cookies] = useCookies([]);
    const [getNotifications, setNotifications] = useState([]);
    const [responseDataStatus, setResponseDataStatus] = useState(Number);
    const [responseData, setResponseData] = useState('');
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [getFirst, setFirst] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);

    const notificationsService = new NotificationsService();

    const rows = 10;
    
    useEffect(() => {
        document.title = 'GAFio | Notificações';
        setLoading1(true);
        setTimeout(() => {
            getNotificationFunction();
        },1000);
    }, []);

    const onPage = (event: any) => {
        setLoading(true);
        setTimeout(() => {
            let CodUsuario = cookies.userData.CodUsuario;
            let TipoUsuario = cookies.userData.TipoUsuario;
            const startIndex = event.first;
            const endIndex = event.first + rows;
            console.log(endIndex);
            notificationsService.getNotifications(CodUsuario, TipoUsuario, endIndex).then(data => {
                console.log(data)
                setNotifications(data.notifications)
                setLoading(false)
            })
            setFirst(startIndex);
            setNotifications(getNotifications.slice(startIndex, endIndex));
            setLoading(false);
        }, 1000)
    }
    
    function getNotificationFunction(){
        if(cookies.userData){
            setNotifications([])
            let CodUsuario = cookies.userData.CodUsuario;
            let TipoUsuario = cookies.userData.TipoUsuario;
            setTimeout(() => {
                notificationsService.getNotifications(CodUsuario, TipoUsuario, getFirst+rows).then(data => {
                    console.log(data)
                    setTotalRecords(data.length-10);
                    setNotifications(data.notifications)
                    setLoading(false)
                    setLoading1(false)
                })
            }, 300)
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
            {loading1 &&
                <Loading/>
            }
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
                {getNotifications &&
                    <DataTable className="col-sm-8 offset-sm-8 mx-auto p-0 shadow-lg p-datatable-responsive-demo" value={getNotifications} paginator={true} 
                        rows={rows} totalRecords={totalRecords} emptyMessage="Nenhum resultado encontrado" resizableColumns={true}
                        loading={loading} first={getFirst} onPage={onPage} lazy={true}>
            
                        <Column field="CodNotificacao" header="CodNotificação" style={{width:'15%', textAlign:'center'}}/>
                        <Column field="CodUsuario" header="CodUsuário" style={{width:'15%', textAlign:'center'}}/>
                        <Column field="Descricao" header="Descrição" style={{width:'45%', textAlign:'center'}}/>
                        <Column header="Ações"  body={actionTemplate} style={{width:'20%', textAlign:'center'}}/>
                    </DataTable>
                }
            </div>
        </>
    )
}

export default Notifications;