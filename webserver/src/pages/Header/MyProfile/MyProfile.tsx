import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import api from '../../../services/api';
import { useCookies } from 'react-cookie';

const MyProfile = () => {
    const history = useHistory();
    
    const [cookies] = useCookies([]);
    const [responseDataStatus, setResponseDataStatus] = useState(Number);
    const [enableSubmitButton] = useState(0);
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
        nome: '',
        email: '',
        matricula: '',
        tipoUsuario: ''
    });

    
    useEffect(() => {
        document.title = 'GAFio | Meus Dados';
        if(cookies.userData){
            const email = cookies.userData.Email;
            api.get(`users/email/${email}`).then(response => {
                var {id, Nome, Matricula, Email, TipoUsuario} = response.data;
                setInitData({...initData, id: id, nome: Nome, email: Email, matricula: Matricula, tipoUsuario: TipoUsuario});
                setFormData({...initData, nome: Nome, email: Email, matricula: Matricula, tipoUsuario: TipoUsuario});
                setPharmaceuticalStatus(TipoUsuario);
            })
        }else{
            history.push('/login');
            alert('ERROR. Faça login novamente para acessar o conteúdo.');
        }      
    }, [cookies.userData, history, initData]);
    // useEffect(() => {
    // }, []);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target
        setFormData({...formData, [name]: value})
    }
    
    function handleSubmit(event: FormEvent){
        event.preventDefault();
        const {nome, email, matricula} = formData;        
        
        // const token = jwt.sign({nome: nome, email: email, matricula: matricula}, secretWord);
        api.post('users', {nome: nome, email: email, matricula: matricula})
        .then(function(response){
            if(response.data.createdUser){
                setResponseDataStatus(1);
                setResponseData('Usuário criado com sucesso.');
                setTimeout(function(){history.push('/login')}, 3000);
            }else{
                if(response.data.status === 502){
                    setResponseData('Error 502 Bad Gateway. Contate o administrador do sistema para mais detalhes. Erro: UserCreationDatabase')
                }else{
                    setResponseData(response.data.error);
                }
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
    
    return (
        <div className="row m-5">
            <div className="card shadow-lg p-3 col-sm-6 offset-md-3 border">
                <p className="text-dark h3 text-center">Dados do usuário</p>
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
                    <div className="m-4"></div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" className="form-control" id="email" name="email" onChange={handleInputChange} defaultValue={initData['email']} placeholder="Digite seu email" required/>
                    <div className="m-4"></div>
                    <label htmlFor="matricula">Matrícula:</label>
                    <input type="text" className="form-control" id="matricula" name="matricula" onChange={handleInputChange} defaultValue={initData['matricula']} placeholder="Digite sua matrícula" required/>
                    <div className="m-4"></div>
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
                        ? <button type="button" onClick={requestChangeUserType} className="btn btn-danger">Solicitar alteração</button>
                        : <></>
                    }
                </div>
                {
                enableSubmitButton === 0
                ? <button type="submit" className="btn btn-primary disabled" disabled>Entrar</button>
                : <button type="submit" className="btn btn-primary">Entrar</button>
                }
                </form>
            </div>
        </div>
    )
}

export default MyProfile;