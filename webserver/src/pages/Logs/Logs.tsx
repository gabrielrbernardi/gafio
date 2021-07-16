import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { getEnabledCategories } from 'trace_events';
import ToastComponent from '../../components/Toast';
import { RadioButton } from 'primereact/radiobutton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

import api from '../../services/api';
import "./styles.css";
import { Button, Spinner } from 'react-bootstrap';
import { FiRefreshCcw } from 'react-icons/fi';

var optionsLogType = {menuPrincipal: -1, menuMicrobiologia: -1, menuPaciente: -1, menuProntuario: -1}; //Menu principal, menu microbiologia, menu paciente

const Logs = () => {
    const history = useHistory();
    const [getContent, setContent] = useState();

    const [totalRecords, setTotalRecords] = useState(0);
    const [getLoading, setLoading] = useState(false);
    
    let logType = -1;
    let logType1 = -1;
    let logType2 = -1;
    let microbiologyLogType: string;
    const [getLogType, setLogType] = useState(-1);
    const [getLogType1, setLogType1] = useState(-1);
    const [getLogType2, setLogType2] = useState(-1);
    const [getShowLogType1, setShowLogType1] = useState(-1);
    const [getShowError, setShowError] = useState(false);
    const [getShowId, setShowId] = useState(false);
    
    const [getMicrobiologyLogType, setMicrobiologyLogType] = useState("");

    const [getSpecificColumnHeader, setSpecificColumnHeader] = useState("");
    const [getSpecificColumnField, setSpecificColumnField] = useState("");
    
    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');
    
    useEffect(() => {
        
    }, [])
    
    async function getLogs(){
        setLoading(true);
        setContent(undefined)
        setTimeout(async () => {
            if(optionsLogType.menuPrincipal == 0){ //Get login logs
                optionsLogType.menuMicrobiologia = -1;
                optionsLogType.menuPaciente = -1;
                optionsLogType.menuProntuario = -1;
                await api.get('/logs/login').then(response => {
                    if(response.data.showLogs){
                        setContent(response.data.logs);
                        setTotalRecords(response.data.length);
                        showToast('success', "Resultados Encontrados", "Foram encontrados " + response.data.length + " resultados")
                    }
                }).catch(err => {
                    showToast('error', "Erro", err.response.data.error)
                })
            }else if(optionsLogType.menuPrincipal == 1){ //Get microbiology logs
                optionsLogType.menuPaciente = -1;
                optionsLogType.menuProntuario = -1;
                if(optionsLogType.menuMicrobiologia == 0){
                    microbiologyLogType = "successfulCreations";
                    setMicrobiologyLogType("successfulCreations");
                }else if(optionsLogType.menuMicrobiologia == 1){
                    microbiologyLogType = "successfulExclusions";
                    setMicrobiologyLogType("successfulExclusions")
                }else if(optionsLogType.menuMicrobiologia == 2){
                    microbiologyLogType = "successfulUpdates";
                    setMicrobiologyLogType("successfulUpdates")
                }else if(optionsLogType.menuMicrobiologia == 3){
                    microbiologyLogType = "unsuccessfulCreations";
                    setMicrobiologyLogType("unsuccessfulCreations")
                }else if(optionsLogType.menuMicrobiologia == 4){
                    microbiologyLogType = "unsuccessfulExclusions";
                    setMicrobiologyLogType("unsuccessfulExclusions")
                }else if(optionsLogType.menuMicrobiologia == 5){
                    microbiologyLogType = "unsuccessfulUpdates";
                    setMicrobiologyLogType("unsuccessfulUpdates")
                }

                if(optionsLogType.menuMicrobiologia == 1 || optionsLogType.menuMicrobiologia == 2 || optionsLogType.menuMicrobiologia == 4 || optionsLogType.menuMicrobiologia == 5){ setShowId(true) } else { setShowId(false) };
                if(optionsLogType.menuMicrobiologia == 3 || optionsLogType.menuMicrobiologia == 4 || optionsLogType.menuMicrobiologia == 5){ setShowError(true) } else { setShowError(false) };
                
                await api.post('/logs/microbiology', {logType: microbiologyLogType || getMicrobiologyLogType}).then(response => {
                    setSpecificColumnHeader("Id Microbiologia");
                    setSpecificColumnField("microbiologyId");
                    setContent(response.data.logs);
                    setTotalRecords(response.data.length);
                    showToast('success', "Resultados Encontrados", "Foram encontrados " + response.data.length + " resultados")
                }).catch(err => {
                    showToast('error', "Erro", err.response.data.error)
                })
            }else if(optionsLogType.menuPrincipal == 2){ //Get patient logs
                optionsLogType.menuMicrobiologia = -1;
                optionsLogType.menuProntuario = -1;
                if(optionsLogType.menuPaciente == 0){
                    microbiologyLogType = "successfulCreations";
                    setMicrobiologyLogType("successfulCreations");
                    setShowId(false)
                }else if(optionsLogType.menuPaciente == 1){
                    microbiologyLogType = "successfulUpdates";
                    setMicrobiologyLogType("successfulUpdates");
                    setShowId(true)
                }
                
                await api.post('/logs/patient', {logType: microbiologyLogType}).then(response => {
                    setSpecificColumnHeader("Id Paciente");
                    setSpecificColumnField("patientId");
                    setContent(response.data.logs);
                    setTotalRecords(response.data.length);
                    showToast('success', "Resultados Encontrados", "Foram encontrados " + response.data.length + " resultados")
                }).catch(err => {
                    showToast('error', "Erro", err.response.data.error)
                })
            }else if(optionsLogType.menuPrincipal == 3){ //Get medical records logs
                optionsLogType.menuMicrobiologia = -1;
                optionsLogType.menuPaciente = -1;
                if(optionsLogType.menuProntuario == 0){
                    microbiologyLogType = "successfulCreations";
                    setMicrobiologyLogType("successfulCreations");
                }else if(optionsLogType.menuProntuario == 1){
                    microbiologyLogType = "successfulExclusions";
                    setMicrobiologyLogType("successfulExclusions")
                }else if(optionsLogType.menuProntuario == 2){
                    microbiologyLogType = "successfulUpdates";
                    setMicrobiologyLogType("successfulUpdates")
                }else if(optionsLogType.menuProntuario == 3){
                    microbiologyLogType = "unsuccessfulCreations";
                    setMicrobiologyLogType("unsuccessfulCreations")
                }

                if(optionsLogType.menuProntuario == 1 || optionsLogType.menuProntuario == 2){ setShowId(true) } else { setShowId(false) };
                if(optionsLogType.menuProntuario == 3){ setShowError(true) } else { setShowError(false) };
                await api.post('/logs/medicalRecords', {logType: microbiologyLogType }).then(response => {
                    setSpecificColumnHeader("Id Prontuário");
                    setSpecificColumnField("medicalRecordId");
                    setContent(response.data.logs);
                    setTotalRecords(response.data.length);
                    showToast('success', "Resultados Encontrados", "Foram encontrados " + response.data.length + " resultados")
                }).catch(err => {
                    showToast('error', "Erro", err.response.data.error)
                })
            }
            setLoading(false);
        }, 500)
    }

    function showToast(messageType: string, messageTitle: string, messageContent: string) {
        setToast(false)
        setMessageType(messageType);
        setMessageTitle(messageTitle);
        setMessageContent(messageContent);
        setToast(true);
        setTimeout(() => {
            setToast(false);
        }, 4500)
    }

    const header = (
        <>
            <div>
                <p className="h6">Selecione o Log a ser mostrado</p>
                <ButtonGroup className="col-11 mb-2">
                    {/* <Button variant={getLogType === 0 ? "secondary" : "outline-secondary"} onClick={() => {logType = 0; setShowLogType1(0); setLogType(0); getLogs()} }>Login</Button>
                    <Button variant={getLogType === 1 ? "secondary" : "outline-secondary"} onClick={() => {logType = 1; setShowLogType1(1); setLogType(1)} }>Microbiologia</Button>
                    <Button variant={getLogType === 2 ? "secondary" : "outline-secondary"} onClick={() => {logType = 2; setShowLogType1(2); setLogType(2)} }>Paciente</Button> */}
                    <Button variant={getShowLogType1 == 0 ? "secondary" : "outline-secondary"} onClick={() => {optionsLogType.menuPrincipal = 0; setShowLogType1(0); getLogs()} }>Login</Button>
                    <Button variant={getShowLogType1 == 1 ? "secondary" : "outline-secondary"} onClick={() => {optionsLogType.menuPrincipal = 1; setShowLogType1(1)} }>Microbiologia</Button>
                    <Button variant={getShowLogType1 == 2 ? "secondary" : "outline-secondary"} onClick={() => {optionsLogType.menuPrincipal = 2; setShowLogType1(2)} }>Paciente</Button>
                    <Button variant={getShowLogType1 == 3 ? "secondary" : "outline-secondary"} onClick={() => {optionsLogType.menuPrincipal = 3; setShowLogType1(3)} }>Prontuários</Button>
                </ButtonGroup>
                <Button variant="success" className="float-right mr-lg-2" title="Atualizar" disabled={getLoading} onClick={() => {getLogs(); showToast('info', 'Notificação', `Foram encontrados ${totalRecords} resultados.`)}}>
                    {getLoading
                        ?
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                        : 
                            <FiRefreshCcw size={20}/>
                    }
                </Button>
                <br/>
                {getShowLogType1 == 1
                    ?
                        <ButtonGroup className="container-fluid">
                            <Button variant={ optionsLogType.menuMicrobiologia === 0 ? "success" : "outline-success"} onClick={() => {optionsLogType.menuMicrobiologia = 0; getLogs()} }>Criados com sucesso</Button>
                            <Button variant={ optionsLogType.menuMicrobiologia === 1 ? "success" : "outline-success"} onClick={() => {optionsLogType.menuMicrobiologia = 1; getLogs()} }>Excluídos com sucesso</Button>
                            <Button variant={ optionsLogType.menuMicrobiologia === 2 ? "success" : "outline-success"} onClick={() => {optionsLogType.menuMicrobiologia = 2; getLogs()} }>Atualizados com sucesso</Button>
                            <Button variant={ optionsLogType.menuMicrobiologia === 3 ? "danger" : "outline-danger"} onClick={() => {optionsLogType.menuMicrobiologia = 3; getLogs()} }>Criados sem sucesso</Button>
                            <Button variant={ optionsLogType.menuMicrobiologia === 4 ? "danger" : "outline-danger"} onClick={() => {optionsLogType.menuMicrobiologia = 4; getLogs()} }>Excluídos sem sucesso</Button>
                            <Button variant={ optionsLogType.menuMicrobiologia === 5 ? "danger" : "outline-danger"} onClick={() => {optionsLogType.menuMicrobiologia = 5; getLogs()} }>Atualizados sem sucesso</Button>
                        </ButtonGroup>
                    : getShowLogType1 == 2
                        ?
                            <ButtonGroup className="container-fluid">
                                <Button variant={ optionsLogType.menuPaciente === 0 ? "success" : "outline-success"} onClick={() => {optionsLogType.menuPaciente = 0; getLogs()} }>Criados com sucesso</Button>
                                <Button variant={ optionsLogType.menuPaciente === 1 ? "success" : "outline-success"} onClick={() => {optionsLogType.menuPaciente = 1; getLogs()} }>Excluídos com sucesso</Button>
                            </ButtonGroup>

                        : getShowLogType1 == 3
                            ? 
                                <ButtonGroup className="container-fluid">
                                    <Button variant={ optionsLogType.menuProntuario === 0 ? "success" : "outline-success"} onClick={() => {optionsLogType.menuProntuario = 0; getLogs()} }>Criados com sucesso</Button>
                                    <Button variant={ optionsLogType.menuProntuario === 1 ? "success" : "outline-success"} onClick={() => {optionsLogType.menuProntuario = 1; getLogs()} }>Excluídos com sucesso</Button>
                                    <Button variant={ optionsLogType.menuProntuario === 2 ? "success" : "outline-success"} onClick={() => {optionsLogType.menuProntuario = 2; getLogs()} }>Atualizados com sucesso</Button>
                                    <Button variant={ optionsLogType.menuProntuario === 3 ? "danger" : "outline-danger"} onClick={() => {optionsLogType.menuProntuario = 3; getLogs()} }>Excluídos sem sucesso</Button>
                                </ButtonGroup>
                            : null
                }
            </div>
        </>
    );

    const userColumnTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Usuário</span>
                <a>{rowData.email}</a>
            </React.Fragment>
        )
    }

    const dateColumnTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Data</span>
                <a>{rowData.date}</a>
            </React.Fragment>
        )
    }

    const dynamicColumnTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">{getSpecificColumnHeader}</span>
                <a>{rowData[`${getSpecificColumnField}`]}</a>
            </React.Fragment>
        )
    }

    const errorColumnTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Erro</span>
                <textarea style={{"width": "100%", "border": "none", "outline": "none", "resize": "none", "height": "8vh", "color": "#212529"}} className="disabled" disabled>{rowData.error}</textarea>
            </React.Fragment>
        )
    }

    return (
        <>
            <div className="row m-md-5 px-5">
                <div className="datatable-responsive-demo">
                    <DataTable emptyMessage={optionsLogType.menuPrincipal == -1 ? "Selecione um filtro!" : "Nenhum resultado encontrado."} className="p-datatable-responsive-demo" header={header} loading={getLoading} resizableColumns={true} value={getContent}>
                        <Column field="email" header="Email" filter filterMatchMode="contains" filterPlaceholder="Search by email" body={userColumnTemplate}></Column>
                        <Column field="date" header="Data" filter filterMatchMode="contains" filterPlaceholder="Search by date" body={dateColumnTemplate}></Column>
                        { optionsLogType.menuPrincipal === 1 || optionsLogType.menuPrincipal === 3
                            ? 
                                getShowId
                                    ?
                                        <Column field={getSpecificColumnField} header={getSpecificColumnHeader} filter filterMatchMode="contains" filterPlaceholder="Search by Id" body={dynamicColumnTemplate}></Column>                      
                                    :
                                        null
                            : null
                        }
                        { optionsLogType.menuPrincipal === 1 || optionsLogType.menuPrincipal === 3
                            ? 
                                getShowError
                                    ?
                                        <Column field="error" header="Erro" filter filterMatchMode="contains" filterPlaceholder="Search by error" body={errorColumnTemplate}></Column>
                                    : 
                                        null
                            : null
                        }
                    </DataTable>
                </div>
            </div>
            {getToast &&
                <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent} />
            }
        </>
    )
}

export default Logs;