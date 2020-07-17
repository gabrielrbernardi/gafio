import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';

import {InputText} from 'primereact/inputtext';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import Button from 'react-bootstrap/Button';
import {Alert} from 'react-bootstrap';

import {FiTrash2, FiCheck, FiSearch} from 'react-icons/fi';
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
    const [searchInput, setSearchInput] = useState('');

    const [alertStatus, setAlertStatus] = useState(0);
    const [alertContent, setAlertContent] = useState('');

    const [position, setPosition] = useState('center');
    const [displayPosition, setDisplayPosition] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [getUser, setUser] = useState<any>(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    let newUser = false;

    const [show, setShow] = useState(false);
    
    const usersService = new UsersService();
    const rows = 10;
    
    let dt = useRef<any>(null);

    const onExport = () => {
        dt.current.exportCSV();
    };

    //DataTable
    useEffect(() => {
        // setTimeout(() => {
            usersService.getUsersPaginate(10).then(data => {
                setDatasource(data.users);
                setTotalRecords(data.length);
                console.log(data)
                data = data.users;
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
        // }, 300);
    }, []);
    
    const onPage = (event: any) => {
        setLoading(true);
        setTimeout(() => {
            const startIndex = event.first;
            const endIndex = event.first + rows;
            console.log(endIndex);
            usersService.getUsersPaginate(endIndex).then(data => {
                setDatasource(data.users);
                console.log(data)
                data = data.users;
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
            setFirst(startIndex);
            setProntuario(datasource.slice(startIndex, endIndex));
            setLoading(false);
        })
    }
    
    const VerifiedTemplate = (rowData: any) => {
        let verifyStatus = rowData.isVerified;
        let fontColor: any = verifyStatus === 'Não' ? "#a80000" : "#106b00";
        return <span style={{color: fontColor}}>{rowData.isVerified}</span>;
    }

    function deleteUser(){
        const codUsuarioDelete = selectedUser.CodUsuario;
        const Email = selectedUser.Email;
        setDisplayDialog(false);
        if(codUsuarioDelete !== cookie.userData.CodUsuario){
            usersService.deleteUser(codUsuarioDelete, Email).then(response => {
                if(response.deletedUser){
                    setAlertStatus(1);
                    setAlertContent('Usuário exluído com sucesso.');
                    setProntuario([]);
                    usersService.getUsersPaginate(10).then(data => {
                        setDatasource(data.users);
                        console.log(data)
                        data = data.users;
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
    function deleteUserCancel(){
        setDisplayDialog(false);
        setAlertStatus(3);
        setAlertContent('Operação cancelada pelo usuário.');
    }
    
    const dialogBox = (rowData: any) => {
        setShow(true);
        return (
            <>  
                {console.log(show)}
                {/* <Modal show={true} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>{rowData['CodUsuario']}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal> */}
            </>
        );
    };

    const actionsTemplate = (rowData: any, column: any) => {
        return (
            <>
                <Button variant="outline-danger" onClick={() => {dialogBox(rowData)} } ><FiTrash2 size={17}/></Button>
            </>
        )
    }

    function handleSearch(){
        alert("filtro inoperante")
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
                : alertStatus === 2
                    ?
                        <Alert variant="danger" className="col-sm-8 mx-auto" onClose={() => setAlertStatus(0)} dismissible>
                            <Alert.Heading className="h5">Erro!</Alert.Heading>
                            <p className="h6">{alertContent}</p>
                        </Alert>
                    : 
                        <Alert variant="warning" className="col-sm-8 mx-auto" onClose={() => setAlertStatus(0)} dismissible>
                            <Alert.Heading className="h5">Alerta!</Alert.Heading>
                            <p className="h6">{alertContent}</p>
                        </Alert>
            }
            <div className="row m-1">
                <span className="p-float-label p-inputgroup col-sm-4 p-0">
                    <InputText className="ml-0 bg-light border border-secondary rounded col-sm-8" id="float-input" type="search" value={searchInput} onChange={(e) => {setSearchInput((e.target as HTMLInputElement).value)}} size={50}/>
                    <label htmlFor="float-input">Buscar por email</label>
                    {searchInput
                    ? 
                        <>
                            <Button tabIndex={2} variant="outline-danger" className="p-0 mr-1" style={{width: '17px'}} onClick={() => setSearchInput('')}><AiOutlineClose size={15}/></Button>
                            <Button onClick={handleSearch}><FiSearch size={20}/></Button>
                        </>
                    : <></>
                    }
                </span>
                <Button className="col-md-2 offset-md-6" type="button" variant="outline-success" onClick={onExport}><AiOutlineDownload size={20}/>  Exportar dados</Button>
            </div>
            <p style={{textAlign:'left'}} className="p-clearfix d-inline">Selecione um usuário para mais informações</p>

        </>
    );
   
    const onUserSelect = (e: any) => {
        newUser = false;
        setUser(Object.assign({}, e.data));
        setDisplayDialog(true);
    };
    
    const dialogFooter = 
        <div className="ui-dialog-buttonpane p-clearfix">
            <Button variant="outline-danger" onClick={() => {deleteUserCancel()}}><p className="d-inline"><AiOutlineClose size={30}/>  Cancelar</p></Button>
            <Button variant="success" onClick={() => deleteUser()}><p className="d-inline"><FiCheck size={30}/>  Confirmar</p></Button>
        </div>;
    
    return (
        <>
            <div className="row m-5 px-5">              
                <DataTable ref={dt} value={prontuario} paginator={true} rows={rows} header={header} totalRecords={totalRecords}
                    emptyMessage="Nenhum resultado encontrado" responsive={true} resizableColumns={true} loading={loading} first={first}
                    onPage={onPage} lazy={true} selectionMode="single" selection={selectedUser} onSelectionChange={e => setSelectedUser(e.value)}
                    onRowSelect={onUserSelect}>
                    <Column field="CodUsuario" header="Código" style={{width:'12%', textAlign:'center'}}/>
                    <Column field="Nome" header="Nome" style={{width:'16%', textAlign:'center'}}/>
                    <Column field="Email" header="Email" style={{width:'20%', textAlign:'center'}}/>
                    <Column field="Matricula" header="Matrícula" style={{width:'14%', textAlign:'center'}}/>
                    <Column field="TipoUsuario" header="Tipo usuário" style={{width:'16%', textAlign:'center'}}/>
                    <Column field="isVerified" header="Verificado" style={{width:'10%', textAlign:'center'}} body={VerifiedTemplate}/>
                    <Column header="Ações" body={actionsTemplate} style={{textAlign:'center', width: '10%'}}/>
                </DataTable>
                <Dialog visible={displayDialog} style={{width: '50%'}} header="Confirmar exclusão" modal={true} footer={dialogFooter} onHide={() => setDisplayDialog(false)}
                    blockScroll={false}>
                    { getUser &&
                        <p className="h6">Deseja excluir o usuário "{selectedUser.Nome}" de código "{selectedUser.CodUsuario}" do sistema?</p>
                    }
                </Dialog>
            </div>
            
        </>
    )
}

export default MedicalRecords;