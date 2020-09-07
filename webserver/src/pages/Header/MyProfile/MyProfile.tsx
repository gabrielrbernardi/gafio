import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {FaPenAlt} from 'react-icons/fa'

import api from '../../../services/api';
import { useCookies } from 'react-cookie';
import { Button } from 'react-bootstrap';
import {FiCheckCircle} from 'react-icons/fi';

import {Dialog} from 'primereact/dialog';
// import {Button} from 'primereact/button';

const MyProfile = () => {
    const history = useHistory();
    
    const [cookies] = useCookies([]);
    const [responseDataStatus, setResponseDataStatus] = useState(Number);
    const [, setEditable] = useState(0);
    const [responseData, setResponseData] = useState('');
    const [pharmaceuticalStatus, setPharmaceuticalStatus] = useState('');

    const [initData, setInitData] = useState({
        id: '',
        nome: '',
        email: '',
        matricula: '',
        tipoUsuario: ''
    })

    const [formData, setFormData] = useState({
        nome: "null",
        email: "null",
        matricula: "null",
        tipoUsuario: "null"
    });

    useEffect(() => {
        document.title = 'GAFio | Meu Perfil';
    }, [])

    useEffect(() => {
        if(cookies.userData){
            const email = cookies.userData.Email;
            api.get(`users/email/?email=${email}&page=10`).then(response => {
                var {CodUsuario, Nome, Matricula, Email, TipoUsuario} = response.data.users[0];
                setInitData({...initData, id: CodUsuario, nome: Nome, email: Email, matricula: Matricula, tipoUsuario: TipoUsuario});
                setFormData({...formData, nome: Nome, email: Email, matricula: Matricula, tipoUsuario: TipoUsuario});
                // setFormData({...formData, nome: Nome, email: Email, matricula: Matricula, tipoUsuario: TipoUsuario});
                setPharmaceuticalStatus(TipoUsuario);
            })
        }else{
            history.push('/login');
            alert('ERROR. Faça login novamente para acessar o conteúdo.');
        }      
    }, [cookies.userData, history]);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target
        setFormData({...formData, [name]: value})
    }
    
    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        const {nome, email, matricula} = formData;
        
        // const token = jwt.sign({nome: nome, email: email, matricula: matricula}, secretWord);
        await api.put(`/users/${initData['id']}}`, {nome: nome, email: email, matricula: matricula})
        .then(function(response){
            if(response.data.updatedUser){
                setResponseDataStatus(1);
                setResponseData('Informações alteradas com sucesso.');
                api.get(`users/email/?email=${email}&page=10`).then(response1 => {
                    var {CodUsuario, Nome, Matricula, Email, TipoUsuario} = response1.data.users[0];
                    setFormData({...formData, nome: Nome, email: Email, matricula: Matricula, tipoUsuario: TipoUsuario});
                    setInitData({...initData, id: CodUsuario, nome: Nome, email: Email, matricula: Matricula, tipoUsuario: TipoUsuario});
                    setPharmaceuticalStatus(TipoUsuario);
                })
                // setTimeout(function(){history.push('/login')}, 3000);
            }else{
                setResponseData(response.data.error);
                setResponseDataStatus(2);
            }
        })
     }

    function requestChangeUserType(){
        api.put(`users/requestChangeUserType/${initData['id']}`, {TipoNotificacao: "Change"}).then(response => {
            if(response.data.requestChangeUserType){
                setResponseDataStatus(1);
                setResponseData('Solicitação feita com sucesso.');
            }else{
                setResponseDataStatus(2);
                setResponseData(response.data.error);
            }
        })
        // alert('solicitar alteracao do tipo de usuario');
    }

    const [position, setPosition] = useState('center');
    const [displayPosition, setDisplayPosition] = useState(false);

    const onClick = (stateMethod: any, position: string = '') => {
        stateMethod(true);

        if (position) {
            setPosition(position);
        }
    }

    const onHide = (stateMethod: any) => {
        stateMethod(false);
    }
    
    const renderFooter = (stateMethod: any) => {
        return (
            <div>
                <button type="submit" className="btn btn-primary" onClick={handleSubmit}><p className="d-inline" onClick={() => onHide(stateMethod)}><FiCheckCircle size={30}/>  Finalizar Edição</p></button>
                {/* <Button label="Yes" icon="pi pi-check"  />
                <Button label="No" icon="pi pi-times" onClick={() => onHide(stateMethod)} className="p-button-secondary"/> */}
            </div>
        );
    }
    
    return (
        <div className="row m-5">
            <div className="card shadow-lg p-3 col-sm-6 offset-md-3 border">
                <p className="text-dark h3 text-center">Dados do usuário</p>
                <Button type="button" variant="outline-info" className="float-right" onClick={() => {onClick(setDisplayPosition, 'top'); setEditable(1)}}><FaPenAlt size={15}/>  Editar Informações</Button>
                <Dialog header="Editar dados do Usuário" visible={displayPosition} style={{width: '50vw'}} onHide={() => onHide(setDisplayPosition)} position={position} footer={renderFooter(setDisplayPosition)}>
                    <form className="was-validated" onSubmit={handleSubmit}>
                        <div className="form-group">
                            {responseDataStatus === 0
                            ? <div></div>
                            : responseDataStatus === 1 
                                ?
                                <div className="alert alert-success alert-dismissible fade show">
                                    {responseData}
                                </div>
                                :
                                <div className="alert alert-danger alert-dismissible fade show">
                                    {responseData}
                                </div>
                            }
                            <label htmlFor="nome">Nome Completo:</label>
                            <input type="text" className="form-control" id="nome" name="nome" onChange={handleInputChange} defaultValue={initData['nome']} placeholder="Digite seu nome" required/>
                            {/* <input type="text" className="form-control" id="nome" name="nome" onChange={handleInputChange} defaultValue={initData['nome']} placeholder="Digite seu nome" required/> */}
                            <div className="m-4"></div>
                            <label htmlFor="email">Email:</label>
                            <input type="email" className="form-control disabled" disabled id="email" name="email" onChange={handleInputChange} defaultValue={initData['email']} placeholder="Digite seu email" required/>
                            <div className="m-4"></div>
                            <label htmlFor="matricula">Matrícula:</label>
                            <input type="text" className="form-control" id="matricula" name="matricula" onChange={handleInputChange} defaultValue={initData['matricula']} placeholder="Digite sua matrícula" required/>                        
                        </div>
                    </form>
                </Dialog>
                <div className="m-2"></div>
                {responseDataStatus === 0
                ? <div></div>
                : responseDataStatus === 1 
                    ?
                    <div className="alert alert-success alert-dismissible fade show">
                        {responseData}
                    </div>
                    :
                    <div className="alert alert-danger alert-dismissible fade show">
                        {responseData}
                    </div>
                }
                
                <label htmlFor="nome">Nome Completo:</label>
                <label className="form-control">{initData['nome']}</label>
                <div className="m-2"></div>
                <label htmlFor="email">Email:</label>
                <input type="email" className="form-control disabled" disabled id="email" name="email" onChange={handleInputChange} defaultValue={initData['email']} placeholder="Digite seu email" required/>
                <div className="m-2"></div>
                <label htmlFor="matricula">Matrícula:</label>
                <label className="form-control">{initData['matricula']}</label>
                <div className="m-2"></div>
                <label htmlFor="matricula">Tipo de usuário atual:
                    {
                        pharmaceuticalStatus === 'F'
                        ? <label><strong>Farmacêutico</strong></label>
                        : pharmaceuticalStatus === 'M' 
                            ? <label><strong>Médico</strong></label>
                            : <label><strong>Administrador</strong></label>
                    }
                </label>
                <br/>
                {
                    pharmaceuticalStatus === 'F'
                    ? <button type="button" onClick={requestChangeUserType} className="btn btn-outline-secondary">Solicitar alteração</button>
                    : <></>
                }
                {/* {editable === 0
                ? <Button type="button" variant="outline-info" className="float-right" onClick={() => setEditable(1)}><FaPenAlt size={15}/></Button>
                : <Button type="button" variant="outline-info" className="float-right disabled" disabled onClick={() => setEditable(1)}><FaPenAlt size={15}/></Button>
                } */}
                
                <br/>
            </div>
        </div>
    )
}

export default MyProfile;