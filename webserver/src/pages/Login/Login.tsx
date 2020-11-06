import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import { useCookies } from 'react-cookie';
import jwt from 'jsonwebtoken';

import './login.css';

import { InputText } from 'primereact/inputtext';
import loginBanner from '../../assets/fiocruzBanner.jpg';
import api from '../../services/api';
import ToastComponent from '../../components/Toast';

// const secretWord = 'PalavraSecreta';

declare module "jsonwebtoken"{
    export function decode(
        token: string
    ): {Email: string, Nome: string, TipoUsuario: string, CodUsuario: string};
}

const Login = () => {
    const history = useHistory();

    const [enableSubmitButton, setEnableSubmitButton] = useState(Number);
    const [, setCookies] = useCookies([]);
    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');
  
    const [formData, setFormData] = useState({
        email: '',
        senha: '',
    });

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target
        setFormData({...formData, [name]: value})
        if(formData['email'] && formData['senha']){
            setEnableSubmitButton(1);
        }else{
            setEnableSubmitButton(0);
        }
    }
    
    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        const {email, senha} = formData;
        // const token = jwt.sign({email: email, senha: senha}, secretWord);
        try{
            await api.post('session/login', {email: email, senha: senha})
            .then(function(response){
                if(response.data.userLogin){
                    const tokenLoginResponse = jwt.decode(response.data.userToken);
                    var Email = tokenLoginResponse.Email;
                    let Nome = tokenLoginResponse.Nome;
                    let TipoUsuario = tokenLoginResponse.TipoUsuario;
                    let CodUsuario = tokenLoginResponse.CodUsuario;
                    setCookiesLogin(Email, Nome, TipoUsuario, CodUsuario);
                }else{
                    showToast('error', 'Erro!', response.data.error);
                }
            })
        }catch(err) {
            if(err.message === "Network Error"){
                showToast('error', 'Erro!', 'Não foi possível conectar ao servidor.')
            }
        }
    }

    function showToast(messageType: string, messageTitle: string, messageContent: string){
        setToast(false)
        setMessageType(messageType);
        setMessageTitle(messageTitle);
        setMessageContent(messageContent);
        setToast(true);
        setTimeout(() => {
            setToast(false);
        }, 4500)
    }
    
    async function setCookiesLogin(email: string, nome: string, tipoUsuario: string, codUsuario: string){
        let nomeArray = nome.split(' ');
        nome = nomeArray[0];
        // await api.post(`notifications/length/${codUsuario}`, {TipoUsuario: tipoUsuario}).then(response => {
        //     console.log(response)
        //     if(response.data.notificationFound){
        //         setCookies('notificationLength', {length: response.data.length})
        //     }
        // })
        setCookies('userData', {Email: email, Nome: nome, TipoUsuario: tipoUsuario, CodUsuario: codUsuario});
        history.push('/home');
    }

    useEffect(() => {
        document.title = 'GAFio | Login';
    }, []);

    return (
        <div>
            <div className="row m-5"> 
                    <img className="rounded col-sm-7 " src={loginBanner} alt="Banner"/>
                <div className="card col-sm-5 p-5 bg-light shadow-lg float-right text-center">
                    <form className="was-validated pb-2" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <InputText type="email" style={{width: '100%'}} id="email" name="email" onChange={handleInputChange} placeholder="Digite seu email" required autoFocus autoComplete="off"/>
                        
                        <div className="valid-feedback text-left">Válido.</div>
                        <div className="invalid-feedback text-left">Preencha este campo.</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha:</label>
                        <InputText type="password" style={{width: '100%'}} id="password" name="senha" onChange={handleInputChange} minLength={8} placeholder="Digite sua senha" required/>
                        
                        <div className="valid-feedback text-left">Válido.</div>
                        <div className="invalid-feedback text-left">Preencha este campo.</div>
                    </div>
                    {
                        enableSubmitButton === 0
                        ? <button type="submit" className="btn btn-info btn-primary disabled mt-2 mb-3" disabled>Entrar</button>
                        : <button type="submit" className="btn btn-info btn-primary mt-2 mb-3">Entrar</button>
                    }
                    </form>
                    <div col-1>
                        <span>Ainda não possui cadastro?</span><br/>
                        <Link to="/signUp">
                            <span className="text-info">Crie já o seu</span>
                        </Link>
                    </div>
                </div>
                {getToast &&
                    <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent}/>
                }
            </div>
        </div>
    )
}

export default Login;