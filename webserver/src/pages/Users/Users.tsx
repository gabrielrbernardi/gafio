import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';

import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import Button from 'react-bootstrap/Button';
import { Dropdown as DropdownReact, Spinner } from 'react-bootstrap';

import { FiCheck, FiSearch, FiRefreshCcw } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';

import { UsersService } from './UsersService';
import { Dialog } from 'primereact/dialog';

import './Users.css';
import ToastComponent from '../../components/Toast';
import Loading from '../../components/Loading';

const Users = () => {
    const [cookie] = useCookies();
    const [prontuario, setProntuario] = useState([]);
    const [datasource, setDatasource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [getFirst, setFirst] = useState(0);
    const [getEnd, setEnd] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [getMode, setMode] = useState<string>('N');

    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [getUser, setUser] = useState<any>(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    let newUser = false;
    const [getOptionState, setOptionState] = useState<any>(null)
    const [getUserChange, setUserChange] = useState<string>('');
    const [getUserVerifyOption, setUserVerifyOption] = useState<string>('');

    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');

    const usersService = new UsersService();
    const rows = 10;

    let dt = useRef<any>(null);

    const onOptionChange = (e: { value: any }) => {
        setOptionState(e.value);
    };

    const onUserSelectChange = (e: { value: any }) => {
        setUserChange(e.value);
    };

    const onUserSelectVerifyChange = (e: { value: any }) => {
        setUserVerifyOption(e.value);
    };

    let options = [
        { name: 'CódUsuário', cod: 'C' },
        { name: 'Nome', cod: 'N' },
        { name: 'Email', cod: 'E' },
        { name: 'Matrícula', cod: 'M' },
        { name: 'TipoUsuário', cod: 'TU' }
    ];

    let tipoUsuario = [
        { label: 'Administrador', value: 'A' },
        { label: 'Médico', value: 'M' },
        { label: 'Farmacêutico', value: 'F' },
        { label: 'Leitor', value: 'L' },
    ];

    let verifyOptions = [
        { label: 'Sim', value: 'S' },
        { label: 'Não', value: 'N' },
    ];

    //DataTable
    useEffect(() => {
        setLoading1(true);
        setTimeout(() => {
            usersService.getUsersPaginate(10).then(data => {
                getUsersFunction(data)
                showToast('info', 'Resultados Encontrados!', `Foram encontrados ${data.length} resultados.`)
            });
        }, 1000)
    }, []);

    const onPage = (event: any) => {
        setLoading(true);
        setTimeout(() => {
            const startIndex = event.first;
            const endIndex = event.first + rows;
            if (getMode === 'S') {
                usersService.searchUserGlobal(searchInput, getOptionState.cod, endIndex).then(data => {
                    if (!data.userFound) {
                        setLoading(false);
                        setProntuario([]);
                        return
                    }
                    getUsersFunction(data)
                })
            } else if (getMode === 'N') {
                usersService.getUsersPaginate(endIndex).then(data => {
                    getUsersFunction(data);
                });
            }
            setFirst(startIndex);
            setEnd(endIndex);
            setProntuario(datasource.slice(startIndex, endIndex));
        }, 500)
    }

    /*************************************************
     * Nome: codUsuarioBodyTemplate, nomeBodyTemplate, emailBodyTemplate, matriculaBodyTemplate, tipoUsuarioBodyTemplate
     * Descricao:
     *  Ao chamar a funcao, o mesmo faz o tratamento dos dados para que a visualizacao seja responsiva
     * Parametros:
     *  rowData: Conteudo da linha a ser mostrado. Objeto
     * Retorno:
     *  Codigo em HTML para ser adicionado ao campo do datatable
    **************************************************/
    const codUsuarioBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Código</span>
                <a>{rowData.CodUsuario}</a>
            </React.Fragment>
        );
    }

    const nomeBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Nome</span>
                <a>{rowData.Nome}</a>
            </React.Fragment>
        );
    }

    const emailBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Email</span>
                <a>{rowData.Email}</a>
            </React.Fragment>
        );
    }

    const matriculaBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Matrícula</span>
                <a>{rowData.Matricula}</a>
            </React.Fragment>
        );
    }

    const tipoUsuarioBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Tipo usuário</span>
                <a>{rowData.TipoUsuario}</a>
            </React.Fragment>
        );
    }
    
    /*************************************************
     * Nome: VerifiedTemplate
     * Descricao:
     *  Ao chamar a funcao, o mesmo faz o tratamento dos dados para que a visualizacao seja responsiva e facilite a visualizacao dos dados com cores
     * Parametros:
     *  rowData: Conteudo da linha a ser mostrado. Objeto
     * Retorno:
     *  Codigo em HTML para ser adicionado ao campo do datatable
    **************************************************/
    const VerifiedTemplate = (rowData: any) => {
        let verifyStatus = rowData.isVerified;
        let fontColor: any = verifyStatus === 'Não' ? "#a80000" : "#106b00";
        return (
            <React.Fragment>
                <span className="p-column-title">Verificado</span>
                <a style={{ color: fontColor }}>{verifyStatus}</a>
            </React.Fragment>
        );
    }

    /*************************************************
     * Nome: deleteUser
     * Descricao:
     *  Funcao para fazer a exclusao do usuario selecionado
     * Parametros:
     *  Nao possui parametros
     * Retorno:
     *  Nao possui retorno
    **************************************************/
    function deleteUser() {
        const codUsuarioDelete = selectedUser.CodUsuario;
        const Email = selectedUser.Email;
        setDisplayDialog(false);
        if (codUsuarioDelete !== cookie.userData.CodUsuario) {
            usersService.deleteUser(codUsuarioDelete, Email).then(response => {
                if (response.deletedUser) {
                    showToast('success', 'Sucesso!', 'Usuário exluído com sucesso.');
                    setProntuario([]);
                    usersService.getUsersPaginate(10).then(data => {
                        getUsersFunction(data)
                    });
                } else {
                    showToast('error', 'Erro!', response.error);
                }
            })
        } else {
            showToast('error', 'Erro!', 'Não é possível excluir o próprio usuário.');
        }
        setUserChange('F');
    }

    /*************************************************
     * Nome: dialogCancel
     * Descricao:
     *  Funcao para administrar o fechamento de um Dialog
     * Parametros:
     *  status: Status da mensagem a ser mostrada no Toast de alerta
     *  message: Mensagem a ser mostrada no Toast de alerta
     * Retorno:
     *  Nao possui retorno
    **************************************************/
    function dialogCancel(status: string, message: string) {
        setDisplayDialog(false);
        showToast(status, 'Aviso!', message);
        setUserChange('F');
    }

    /*************************************************
     * Nome: changeUserType
     * Descricao:
     *  Funcao para fazer a alteração de tipo de usuario
     * Parametros:
     *  Nao possui parametros
     * Retorno:
     *  Nao possui retorno
    **************************************************/
    function changeUserType() {
        const userId = selectedUser.CodUsuario;
        const currentUserId = Number(cookie.userData.CodUsuario);
        setTimeout(async () => {
            await usersService.changeUserType(userId, getUserChange, currentUserId).then(response => {
                if (response.updatedUser) {
                    showToast('success', 'Sucesso!', `A permissão do usuário ${selectedUser.Nome} foi alterada com sucesso.`);
                    getUsersFunction();
                } else {
                    showToast('error', 'Erro!', response.error);
                }
                setDisplayDialog(false);
            }).catch(err => {
                showToast('error', "Erro", err.response.data.error)
            })
            setUserChange('F');
        }, 300);
    }

    /*************************************************
     * Nome: changeVerifyUser
     * Descricao:
     *  Funcao para fazer a alteração da verificacao de usuario
     * Parametros:
     *  Nao possui parametros
     * Retorno:
     *  Nao possui retorno
    **************************************************/
    function changeVerifyUser() {
        const userId = selectedUser.CodUsuario;
        setTimeout(() => {
            usersService.changeVerifyUser(userId, getUserVerifyOption).then(response => {
                if (response.verifyUser) {
                    showToast('success', 'Sucesso!', `A verificação do usuário "${selectedUser.Nome}" foi alterada com sucesso.`);
                    getUsersFunction();
                } else {
                    showToast('error', 'Erro!', response.error);
                }
            })
            setUserVerifyOption('N');
        }, 300);
        setDisplayDialog(false);
    }
    /*************************************************
     * Nome: getUsersFunction
     * Descricao:
     *  Funcao para buscar e receber os dados a serem inseridos no datatable assim como o tratamento básico dos mesmos
     * Parametros:
     *  data: Opcional. Objeto a ser tratado
     * Retorno:
     *  Retorno para parar a execucao da funcao
    **************************************************/
    function getUsersFunction(data?: any) {
        setLoading(true);
        if (!data) {
            usersService.getUsersPaginate(getEnd).then(data => {
                if(!data.showUsers){
                    showToast('danger', 'Erro!', 'Não foi possível exibir a lista de usuários');
                    // return 
                }else{
                    setDatasource(data.users);
                    setTotalRecords(data.length);
                    data = data.users;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i]['TipoUsuario'] === 'A') {
                            data[i]['TipoUsuario'] = 'Administrador';
                        } else if (data[i]['TipoUsuario'] === 'M') {
                            data[i]['TipoUsuario'] = 'Médico';
                        } else if (data[i]['TipoUsuario'] === 'L'){
                            data[i]['TipoUsuario'] = 'Leitor';
                        } else {
                            data[i]['TipoUsuario'] = 'Farmacêutico';
                        }
                        if (data[i]['isVerified'] === 1) {
                            data[i]['isVerified'] = 'Sim';
                        } else {
                            data[i]['isVerified'] = 'Não';
                        }
                    }
                    setProntuario(data.slice(0, rows));
                    // setLoading(false);
                    // setLoading1(false);
                    // return
                }
            })
        } else {
            if(!data.userFound && !data.showUsers){
                showToast('danger', 'Erro!', 'Não foi possível exibir a lista de usuários');
                // return
            }else{
                setDatasource(data.users || data.showUsers);
                setTotalRecords(data.length);
                data = data.users || data.showUsers;
                for (let i = 0; i < data.length; i++) {
                    if (data[i]['TipoUsuario'] === 'A') {
                        data[i]['TipoUsuario'] = 'Administrador';
                    } else if (data[i]['TipoUsuario'] === 'M') {
                        data[i]['TipoUsuario'] = 'Médico';
                    } else if (data[i]['TipoUsuario'] === 'L'){
                        data[i]['TipoUsuario'] = 'Leitor';
                    } else {
                        data[i]['TipoUsuario'] = 'Farmacêutico';
                    }
                    if (data[i]['isVerified'] === 1) {
                        data[i]['isVerified'] = 'Sim';
                    } else {
                        data[i]['isVerified'] = 'Não';
                    }
                }
                setProntuario(data.slice(0, rows));
                // setLoading(false);
                // setLoading1(false);
                // return
            }
        }
        setTimeout(() => {
            setLoading(false);
            setLoading1(false);
        }, 500)
    }

    /*************************************************
     * Nome: handleSearch
     * Descricao:
     *  Funcao para fazer o tratamento e busca de termos no registro de usuarios
     * Parametros:
     *  Nao possui parametros
     * Retorno:
     *  Retorno para parar a execucao da funcao
    **************************************************/
    function handleSearch() {
        if (!getOptionState) {
            showToast('error', 'Erro!', 'Selecione um filtro para buscar.');
            return
        }
        setLoading(true);
        if (!searchInput) {
            usersService.getUsersPaginate(10).then(data => {
                getUsersFunction(data);
                setLoading(false);
                showToast('error', 'Erro!', 'Digite algum valor para pesquisar.');
            })
            return
        }
        // const primeiro = getFirstString();
        setMode('S');
        usersService.searchUserGlobal(searchInput, getOptionState.cod, getFirst + rows).then(data => {
            if (!data.userFound) {
                setLoading(false);
                setProntuario([]);
                showToast('warn', 'Resultados não encontrados!', 'Não foram encontrados resultados para a busca desejada')
                return
            }
            getUsersFunction(data)
            let searchType;
            if (getOptionState.name === 'CódUsuário') {
                searchType = 'CodUsuario';
            } else if (getOptionState.name === 'Matrícula') {
                searchType = 'Matricula';
            } else if (getOptionState.name === 'TipoUsuário') {
                searchType = 'TipoUsuario'
            } else {
                searchType = getOptionState.name
            }
            let dataSize = data.length[0]['count(`' + searchType + '`)']
            showToast('info', 'Resultados Encontrados!', `Foram encontrados ${dataSize} resultados.`)
        })
    }

    /*************************************************
     * Nome: showToast
     * Descricao:
     *  Funcao para fazer o intermedio a fim de mostrar o component Toast na tela do usuario
     * Parametros:
     *  Nao possui parametros
     * Retorno:
     *  Retorno para parar a execucao da funcao
    **************************************************/
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

    /*************************************************
     * Nome: showData
     * Descricao:
     *  Faz tratamento de erros ao mostrar mensagens
     * Parametros:
     *  data: objeto a ser tratado
     * Retorno:
     *  Retorna String com frase a ser mostrada no componente
    **************************************************/
    function showData(data:any): String{
        try {
            if(data){
                let nome = String(data.Nome);
                let codUsuario = String(data.CodUsuario);
                return `Deseja excluir o usuário "${nome}" de código "${codUsuario}" do sistema?`;
            }else{
                return "Data error! Data is null";
            }
        } catch (error) {
            // showToast('warn', "Erro", error);
            alert(error);
            return error;
        }
    }

    /*************************************************
     * Nome: onUserSelect
     * Descricao:
     *  Ao selecionar um usuario no datatable, a funcao atribui o usuario selecionado a variavel para uso futuro
     * Parametros:
     *  e: evento do tipo any, que em sua maioria sera um objeto
     * Retorno:
     *  Nao possui retorno
    **************************************************/
    const onUserSelect = (e: any) => {
        newUser = false;
        setUser(Object.assign({}, e.data));
        setUserChange(e.data['TipoUsuario'][0]);
        setUserVerifyOption(e.data['isVerified'][0]);
        setDisplayDialog(true);
    };

    const handleUnselectRow = () => {
        // setUser(null);
        setSelectedUser(null)
        // setUserChange('');
        // setUserVerifyOption('');
        // setDisplayDialog(false);
    }

    const header = (
        <>
            <p style={{ textAlign: 'left' }} className="p-clearfix d-inline">Dados dos usuários</p>
            <Button variant="success" className="float-right" title="Atualizar" onClick={() => {getUsersFunction(); showToast('info', 'Notificação', `Foram encontrados ${totalRecords} resultados.`)}}>
                {loading
                    ?
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                    : 
                        <FiRefreshCcw size={20}/>
                }    
            </Button>
            <div className="row">
                <div className="col-sm-6 pl-2">
                    <span className="p-float-label p-inputgroup">
                        <div className="p-col-12">
                            <div className="p-inputgroup mt-4 mb-1">
                                <span className="p-float-label">
                                    <InputText id="float-input" type="search" value={searchInput} onChange={(e) => { setSearchInput((e.target as HTMLInputElement).value) }} onKeyPress={(ev) => { if (ev.key === 'Enter') { handleSearch(); ev.preventDefault(); } }} style={{ minWidth: '8em', borderRadius: '0' }} size={50} />
                                    {getOptionState === null
                                        ? <label htmlFor="float-input">Buscar</label>
                                        : <label htmlFor="float-input">Buscar por {getOptionState.name}</label>
                                    }
                                </span>
                                {searchInput === ''
                                    ? <></>
                                    :
                                    <>
                                        <Dropdown className="mx-1" value={getOptionState} options={options} onChange={onOptionChange} placeholder="Selecione um filtro" optionLabel="name" style={{ width: '12em' }} />
                                        <Button tabIndex={2} variant="outline-danger" className="p-0 mr-1" style={{ width: '17px', borderRadius: '0' }} onClick={() => { setSearchInput(''); getUsersFunction(); setMode('N'); setOptionState(null) }}><AiOutlineClose size={15} /></Button>
                                        <Button onClick={handleSearch} style={{ borderRadius: '0' }}><FiSearch size={20} /></Button>
                                    </>
                                }
                                {/* <Dropdown className="mx-1" value={getOptionState} options={options} onChange={onOptionChange} placeholder="Selecione um filtro" optionLabel="name" style={{width: '12em'}}/>
                                <Button tabIndex={2} variant="outline-danger" className="p-0 mr-1" style={{width: '17px'}} onClick={() => {setSearchInput(''); getUsersFunction(); setMode('N'); setOptionState(null)}}><AiOutlineClose size={15}/></Button>
                                <Button onClick={handleSearch}><FiSearch size={20}/></Button> */}
                            </div>
                        </div>
                        {/* {getOptionState === null
                            ? <label htmlFor="float-input">Buscar</label>
                            : <label htmlFor="float-input">Buscar por {getOptionState.name}</label>
                        } */}
                    </span>
                </div>
                {/* <Button className="col-md-2 offset-md-6" type="button" variant="outline-success" onClick={onExport}><AiOutlineDownload size={20}/>  Exportar dados</Button> */}
            </div>
            <p style={{ textAlign: 'left' }} className="p-clearfix d-inline text-secondary">Selecione um usuário para mais informações</p>

        </>
    );

    const dialogFooter =
        <div className="ui-dialog-buttonpane p-clearfix">
            <Button className="mx-2" variant="outline-danger" onClick={() => { dialogCancel('warn', 'Operação cancelada pelo usuário.') }}><p className="d-inline"><AiOutlineClose size={20} />  Cancelar</p></Button>
        </div>;

    return (
        <>
            <div className="row m-md-5 px-5">
                <div className="datatable-responsive-demo">
                    <DataTable ref={dt} value={prontuario} paginator={true} rows={rows} header={header} totalRecords={totalRecords}
                        emptyMessage="Nenhum resultado encontrado" className="p-datatable-responsive-demo" resizableColumns={true} loading={loading} first={getFirst}
                        onPage={onPage} lazy={true} selectionMode="single" selection={selectedUser} onSelectionChange={e => {setSelectedUser(e.value)}}
                        onRowSelect={onUserSelect} dataKey="CodUsuario">
                        <Column field="CodUsuario" header="Código" body={codUsuarioBodyTemplate}/>
                        <Column field="Nome" header="Nome" body={nomeBodyTemplate}/>
                        <Column field="Email" header="Email" body={emailBodyTemplate}/>
                        <Column field="Matricula" header="Matrícula" body={matriculaBodyTemplate}/>
                        <Column field="TipoUsuario" header="Tipo usuário" body={tipoUsuarioBodyTemplate}/>
                        <Column field="isVerified" header="Verificado" body={VerifiedTemplate} />
                    </DataTable>
                </div>
                <Dialog visible={displayDialog} className="sol-sm-6" header="Ações" modal={true} onHide={() => {setDisplayDialog(false); handleUnselectRow()}}
                    blockScroll={true} footer={dialogFooter}>
                    <p className="h3 mx-2">Alterar tipo de usuário</p>
                    {getUser &&
                        <Dropdown className="mx-2" value={getUserChange} options={tipoUsuario} onChange={onUserSelectChange} style={{ width: '12em' }} />
                    }
                    <Button className="mx-2" variant="outline-success" onClick={() => { changeUserType() }}><p className="d-inline"><FiCheck size={20} />  Confirmar</p></Button>
                    <br /><br />
                    <DropdownReact.Divider />
                    <p className="h3 mx-2">Alterar verificação do usuário</p>
                    {getUser &&
                        <Dropdown className="mx-2" value={getUserVerifyOption} options={verifyOptions} onChange={onUserSelectVerifyChange} style={{ width: '12em' }} />
                    }
                    <Button className="mx-2" variant="outline-success" onClick={() => { changeVerifyUser() }}><p className="d-inline"><FiCheck size={20} />  Confirmar</p></Button>
                    <br /><br />
                    <DropdownReact.Divider />
                    <p className="h3 mx-2">Exclusão</p>
                    {getUser &&
                        // <p className="h6 mx-2">Deseja excluir o usuário "{showData(selectedUser, 1)}" de código "{showData(selectedUser, 2)}" do sistema?</p>
                        <p className="h6 mx-2">{showData(selectedUser)}</p>
                    }
                    <Button className="mx-2" variant="outline-success" onClick={() => deleteUser()}><p className="d-inline"><FiCheck size={20} />  Confirmar</p></Button>
                </Dialog>
                {getToast &&
                    <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent} />
                }
                {loading1 &&
                    <Loading />
                }
            </div>
        </>
    )
}


export default Users;