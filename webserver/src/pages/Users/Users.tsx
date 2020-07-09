import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';

import {InputText} from 'primereact/inputtext';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Dropdown} from 'primereact/dropdown';
import Button from 'react-bootstrap/Button';
import {Alert} from 'react-bootstrap';

import {FiTrash2, FiCheck} from 'react-icons/fi';
import {AiOutlineDownload, AiOutlineClose} from 'react-icons/ai';

import {UsersService} from './UsersService';
import { Dialog } from 'primereact/dialog';

const MedicalRecords = () => {
    const [cookie] = useCookies();
    const [prontuario, setProntuario] = useState([]);
    const [datasource, setDatasource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [first, setFirst] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [globalFilter, setGlobalFilter] = useState<any>(null);
    const [searchInput, setSearchInput] = useState('');

    const [alertStatus, setAlertStatus] = useState(0);
    const [alertContent, setAlertContent] = useState('');

    const [position, setPosition] = useState('center');
    const [displayPosition, setDisplayPosition] = useState(false);

    const [formData, setFormData] = useState({
        email: "null",
        senha: "null"
    });
    
    const usersService = new UsersService();
    const rows = 10;
    
    let dt = useRef<any>(null);

    const onExport = () => {
        dt.current.exportCSV();
    };

    //DataTable
    useEffect(() => {
        setTimeout(() => {
            usersService.getUsers().then(data => {
                setDatasource(data);
                setTotalRecords(2);
                for(let i = 0; i < data.length; i++){
                    if(data[i]['TipoUsuario'] === 'A'){
                        data[i]['TipoUsuario'] = 'Administrador';
                    }else if(data[i]['TipoUsuario'] === 'M'){
                        data[i]['TipoUsuario'] = 'Médico';
                    }else{
                        data[i]['TipoUsuario'] = 'Farmacêutico';
                    }
                    if(data[i]['isVerified'] === 1){
                        data[i]['isVerified'] = 'Sim';
                    }else{
                        data[i]['isVerified'] = 'Não';
                    }
                }
                setProntuario(data.slice(0, rows));
                setLoading(false);
            });
        }, 300);
    }, []);
    
    const onPage = (event: any) => {
        setLoading(true);
        
        const startIndex = event.first;
        const endIndex = event.first + rows;
        
        setFirst(startIndex);
        setProntuario(datasource.slice(startIndex, endIndex));
        setLoading(false);
    }
    
    const VerifiedTemplate = (rowData: any) => {
        let verifyStatus = rowData.isVerified;
        let fontColor: any = verifyStatus === 'Não' ? "#a80000" : "#106b00";

        return <span style={{color: fontColor}}>{rowData.isVerified}</span>;
    }

    function deleteUser(rowData: any){
        const codUsuarioDelete = rowData['CodUsuario'];
        const Email = rowData['Email'];
        if(codUsuarioDelete !== cookie.userData.CodUsuario){
            usersService.deleteUser(codUsuarioDelete, Email).then(response => {
                if(response.deletedUser){
                    setAlertStatus(1);
                    setAlertContent('Usuário exluído com sucesso.');
                    setProntuario([]);
                    usersService.getUsers().then(data => {
                        setDatasource(data);
                        setTotalRecords(2);
                        for(let i = 0; i < data.length; i++){
                            if(data[i]['TipoUsuario'] === 'A'){
                                data[i]['TipoUsuario'] = 'Administrador';
                            }else if(data[i]['TipoUsuario'] === 'M'){
                                data[i]['TipoUsuario'] = 'Médico';
                            }else{
                                data[i]['TipoUsuario'] = 'Farmacêutico';
                            }
                            if(data[i]['isVerified'] === 1){
                                data[i]['isVerified'] = 'Sim';
                            }else{
                                data[i]['isVerified'] = 'Não';
                            }
                        }
                        setProntuario(data.slice(0, rows));
                        setLoading(false);
                    });
                }else{
                    setAlertStatus(2);
                    setAlertContent(response.error);
                }
            })
        }else{
            setAlertStatus(2); 
            setAlertContent('Não é possível excluir o próprio usuário.');
        }
    }

    const onClick = (stateMethod: any, position: string = '') => {
        stateMethod(true);

        if (position) {
            setPosition(position);
        }
    }

    const onHide = (stateMethod: any) => {
        stateMethod(false);
    }
    
    const renderFooter = (stateMethod: any, rowData: any) => {
        return (
            <div>
                <Button variant="outline-danger" onClick={() => setDisplayPosition(false)}><p className="d-inline" onClick={() => onHide(stateMethod)}><AiOutlineClose size={30}/>  Cancelar</p></Button>
                <Button variant="success" onClick={() => {setDisplayPosition(false); deleteUser(rowData)}}><p className="d-inline" onClick={() => onHide(stateMethod)}><FiCheck size={30}/>  Confirmar</p></Button>
            </div>
        );
    }

    const actionsTemplate = (rowData: any, column: any) => {
        return (
            <>
                <Button variant="outline-danger" onClick={() => setDisplayPosition(true) } ><FiTrash2 size={17}/></Button>
                <Dialog header="Confirmação" visible={displayPosition} style={{width: '50vw', textAlign:'left'}} onHide={() => onHide(setDisplayPosition)} footer={renderFooter(setDisplayPosition, rowData)}>
                    Tem certeza que deseja excluir o usuário?
                </Dialog>
                {/* <Button type="button" onClick={() => {deleteUser(rowData)}} variant="outline-danger"><FiTrash2 size={17}/></Button> */}
            </>
        )
    }
    
    const header = (
        <>
            <p style={{textAlign:'left'}} className="p-clearfix d-inline">Dados dos usuários</p>
            {alertStatus === 0
            ? <></>
            : alertStatus === 1
                ?
                    <Alert variant="success" className="col-sm-8 mx-auto" onClose={() => setAlertStatus(0)} dismissible>
                        <Alert.Heading className="h5">Sucesso!</Alert.Heading>
                        <p className="h6">{alertContent}</p>
                    </Alert>
                :
                    <Alert variant="danger" className="col-sm-8 mx-auto" onClose={() => setAlertStatus(0)} dismissible>
                        <Alert.Heading className="h5">Erro!</Alert.Heading>
                        <p className="h6">{alertContent}</p>
                    </Alert>
            }
            <div className="row m-1">
                <span className="p-float-label p-inputgroup col-sm-4 p-0">
                    <InputText className="ml-0 bg-light border border-secondary rounded col-sm-8" id="float-input" type="search" value={searchInput} onChange={(e) => {setGlobalFilter((e.target as HTMLInputElement).value); setSearchInput((e.target as HTMLInputElement).value)}} size={50}/>
                    <label htmlFor="float-input">Buscar</label>
                </span>
                <Button className="col-md-2 offset-md-6" type="button" variant="outline-success" onClick={onExport}><AiOutlineDownload size={20}/>  Exportar dados</Button>
            </div>
        </>
    );

    return (
        <>
            <div className="row m-5 px-5">              
                <DataTable ref={dt} value={prontuario} paginator={true} rows={rows} header={header} totalRecords={totalRecords}
                    globalFilter={globalFilter} emptyMessage="Nenhum resultado encontrado" responsive={true} resizableColumns={true}
                    loading={loading} first={first} onPage={onPage}>
                    {/* <DataTable lazy={true}> */}
                    <Column field="CodUsuario" header="Código" style={{width:'12%', textAlign:'center'}} filter={true} filterPlaceholder="Buscar código" filterMatchMode="contains"/>
                    <Column field="Nome" header="Nome" style={{width:'16%', textAlign:'center'}} filter={true} filterPlaceholder="Buscar nome" filterMatchMode="contains"/>
                    <Column field="Email" header="Email" style={{width:'20%', textAlign:'center'}} filter={true} filterPlaceholder="Buscar email" filterMatchMode="contains"/>
                    <Column field="Matricula" header="Matrícula" style={{width:'14%', textAlign:'center'}} filter={true} filterPlaceholder="Buscar matrícula" filterMatchMode="contains"/>
                    <Column field="TipoUsuario" header="Tipo usuário" style={{width:'16%', textAlign:'center'}} filter={true} filterPlaceholder="Buscar cargo"/>
                    <Column field="isVerified" header="Verificado" style={{width:'10%', textAlign:'center'}} body={VerifiedTemplate} filter={true} filterPlaceholder="Buscar status"/>
                    <Column header="Ações" body={actionsTemplate} style={{textAlign:'center', width: '10%'}}/>
                </DataTable>
            </div>
            
        </>
    )
}

export default MedicalRecords;