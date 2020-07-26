import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';

import {InputText} from 'primereact/inputtext';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Dropdown} from 'primereact/dropdown';
import Button from 'react-bootstrap/Button';
import {Alert} from 'react-bootstrap';
import {Dropdown as DropdownReact} from 'react-bootstrap';

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

    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [getUser, setUser] = useState<any>(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    let newUser = false;
    const [getOptionState, setOptionState] = useState<any>(null)
    const [show, setShow] = useState(false);
    const [getUserChange, setUserChange] = useState<string>('F');
    const [getUserVerifyOption, setUserVerifyOption] = useState<string>('N');
    
    const usersService = new UsersService();
    const rows = 10;
    
    let dt = useRef<any>(null);

    const onExport = () => {
        dt.current.exportCSV();
    };

    const onOptionChange = (e: { value: any }) => {
        setOptionState(e.value);
    };
    
    const onUserSelectChange = (e: { value: any }) => {
        setUserChange(e.value);
    };
    
    const onUserSelectVerifyChange = (e: { value: any }) => {
        setUserVerifyOption(e.value);
        console.log(getUserChange)
        console.log(getUserVerifyOption)
    };
    
    let options = [
        {name: 'CódUsuário', cod: 'C'},
        {name: 'Nome', cod: 'N'},
        {name: 'Email', cod: 'E'},
        {name: 'Matrícula', cod: 'M'},
        {name: 'TipoUsuário', cod: 'TU'}
    ];

    let tipoUsuario = [
        {label: 'Médico', value: 'M'},
        {label: 'Farmacêutico', value: 'F'},
    ];

    let verifyOptions = [
        {label: 'Sim', value: 'S'},
        {label: 'Não', value: 'N'},
    ];

    //DataTable
    useEffect(() => {
        // setTimeout(() => {
            usersService.getUsersPaginate(10).then(data => {
                getUsersFunction(data)
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
                getUsersFunction(data);
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
                        getUsersFunction(data)
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
        setUserChange('F');
    }

    function dialogCancel(status: number, message: string){
        setDisplayDialog(false);
        setAlertStatus(status);
        setAlertContent(message);
        setUserChange('F');
    }

    function changeUserType(){
        const userId = selectedUser.CodUsuario;
        setAlertStatus(0);
        setTimeout(() => {
            usersService.changeUserType(userId, getUserChange).then(response => {
                if(response.updatedUser){
                    setAlertStatus(1);
                    setAlertContent(`A permissão do usuário ${selectedUser.Nome} foi alterada com sucesso.`);
                    getUsersFunction();
                }else{
                    setAlertStatus(2);
                    setAlertContent(response.error)
                }
                setDisplayDialog(false);
            })
            setUserChange('F');
        }, 300);
    }

    function changeVerifyUser(){
        const userId = selectedUser.CodUsuario;
        setAlertStatus(0);
        setTimeout(() => {
            usersService.changeVerifyUser(userId, getUserVerifyOption).then(response => {
                if(response.verifyUser){
                    setAlertStatus(1);
                    setAlertContent(`A verificação do usuário "${selectedUser.Nome}" foi alterada com sucesso.`);
                    getUsersFunction();
                }else{
                    setAlertStatus(2);
                    setAlertContent(response.error)
                }
            })
            setUserVerifyOption('N');
        }, 300);
        setDisplayDialog(false);
    }

    const actionsTemplate = (rowData: any, column: any) => {
        return (
            <>
                <Button variant="outline-danger" onClick={() => {setShow(true)} } ><FiTrash2 size={17}/></Button>
            </>
        )
    }

    function getUsersFunction(data?: any){
        setLoading(true);
        if(!data){
            usersService.getUsersPaginate(10).then(data => {
                setDatasource(data.users);
                setTotalRecords(data.length);
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
                return
            })
        }else{
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
        }
    }

    function handleSearch(){
        setAlertStatus(0);
        if(!getOptionState){
            setAlertContent('Selecione um filtro para buscar.');
            setAlertStatus(2);
            return
        }
        setLoading(true);
        if(!searchInput){
            usersService.getUsersPaginate(10).then(data => {
                getUsersFunction(data);
                setLoading(false);
                setAlertStatus(2);
                setAlertContent("Digite algum valor para pesquisar.");
            })
            return
        }
        usersService.searchUserGlobal(searchInput, getOptionState.cod).then(data => {
            if(!data.userFound){
                setLoading(false);
                setProntuario([]);
                return
            }
            getUsersFunction(data)
        })
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
                <div className="col-sm-4 p-">
                    <span className="p-float-label p-inputgroup">
                        <InputText className="ml-0 bg-light border border-secondary rounded col-sm-8" id="float-input" type="search" value={searchInput} onChange={(e) => {setSearchInput((e.target as HTMLInputElement).value)}} onKeyPress={(ev) => {if (ev.key === 'Enter') {handleSearch(); ev.preventDefault();}}} size={50}/>
                        <label htmlFor="float-input">Buscar por email</label>
                        {searchInput
                        ? 
                        <>
                            <Dropdown className="ml-1" value={getOptionState} options={options} onChange={onOptionChange} placeholder="Selecione um filtro" optionLabel="name" style={{width: '12em'}}/>
                            <Button tabIndex={2} variant="outline-danger" className="p-0 mr-1" style={{width: '17px'}} onClick={() => {setSearchInput(''); getUsersFunction()}}><AiOutlineClose size={15}/></Button>
                            <Button onClick={handleSearch}><FiSearch size={20}/></Button>
                        </>
                        : <></>
                        }
                    </span>
                </div>
                {/* <Button className="col-md-2 offset-md-6" type="button" variant="outline-success" onClick={onExport}><AiOutlineDownload size={20}/>  Exportar dados</Button> */}
            </div>
            <p style={{textAlign:'left'}} className="p-clearfix d-inline text-secondary">Selecione um usuário para mais informações</p>

        </>
    );
   
    const onUserSelect = (e: any) => {
        newUser = false;
        setUser(Object.assign({}, e.data));
        setDisplayDialog(true);
    };
    
    const dialogFooter = 
        <div className="ui-dialog-buttonpane p-clearfix">
            <Button className="mx-2" variant="outline-danger" onClick={() => {dialogCancel(3, 'Operação cancelada pelo usuário.')}}><p className="d-inline"><AiOutlineClose size={20}/>  Cancelar</p></Button>
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
                    {/* <Column header="Ações" body={actionsTemplate} style={{textAlign:'center', width: '10%'}}/> */}
                </DataTable>
                <Dialog visible={displayDialog} style={{width: '50%'}} header="Ações" modal={true} onHide={() => setDisplayDialog(false)}
                    blockScroll={true} footer={dialogFooter}>
                    <p className="h3 mx-2">Alterar tipo de usuário</p>
                    {getUser && 
                        <Dropdown className="mx-2" value={getUserChange} options={tipoUsuario} onChange={onUserSelectChange} style={{width: '12em'}}/>
                    }
                    <Button className="mx-2" variant="outline-success" onClick={() => {changeUserType()}}><p className="d-inline"><FiCheck size={20}/>  Confirmar</p></Button>
                    <br/><br/>
                    <DropdownReact.Divider/>
                    <p className="h3 mx-2">Alterar verificação do usuário</p>
                    {getUser && 
                        <Dropdown className="mx-2" value={getUserVerifyOption} options={verifyOptions} onChange={onUserSelectVerifyChange} style={{width: '12em'}}/>
                    }
                    <Button className="mx-2" variant="outline-success" onClick={() => {changeVerifyUser()}}><p className="d-inline"><FiCheck size={20}/>  Confirmar</p></Button>
                    <br/><br/>
                    <DropdownReact.Divider/>
                    <p className="h3 mx-2">Exclusão</p>
                    { getUser &&
                        <p className="h6 mx-2">Deseja excluir o usuário "{selectedUser.Nome}" de código "{selectedUser.CodUsuario}" do sistema?</p>
                    }
                    {/* <Button className="mx-2" variant="outline-danger" onClick={() => {dialogCancel(3, 'Operação cancelada pelo')}}><p className="d-inline"><AiOutlineClose size={20}/>  Cancelar</p></Button> */}
                    <Button className="mx-2" variant="success" onClick={() => deleteUser()}><p className="d-inline"><FiCheck size={20}/>  Confirmar</p></Button>
                </Dialog>
            </div>
        </>
    )
}


export default MedicalRecords;