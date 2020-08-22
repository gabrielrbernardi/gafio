import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import { useCookies } from 'react-cookie';
import jwt from 'jsonwebtoken';

import './login.css';

import loginBanner from '../../assets/fiocruzBanner.jpg';
import api from '../../services/api';
import Toast from '../../components/Toast';

// const secretWord = 'PalavraSecreta';

declare module "jsonwebtoken"{
    export function decode(
        token: string
    ): {Email: string, Nome: string, TipoUsuario: string, CodUsuario: string};
}

const Login = () => {
    const history = useHistory();

    const [enableSubmitButton, setEnableSubmitButton] = useState(Number);
    const [responseDataStatus, setResponseDataStatus] = useState(Number);
    const [responseData, setResponseData] = useState();
    const [, setCookies] = useCookies([]);
  
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
                    setResponseDataStatus(2);
                    setResponseData(response.data.error);
                }
            })
        }catch(err) {
            alert(err)
            if(err.message === "Network Error"){
                return <Toast status="1" message="teste"/>
            }
        }
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
                    {responseDataStatus === 0
                    ? <div></div>
                    : responseDataStatus === 1 
                        ?
                        <div className="alert alert-success alert-dismissible fade show text-center">
                            <p>{responseData}</p>
                        </div>
                        :
                        <div className="alert alert-danger alert-dismissible fade show text-center">
                            <p>{responseData}</p>
                        </div>
                    }
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" className="form-control" id="email" name="email" onChange={handleInputChange} placeholder="Digite seu email" required autoFocus autoComplete="off"/>
                        <div className="valid-feedback text-left">Válido.</div>
                        <div className="invalid-feedback text-left">Preencha este campo.</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha:</label>
                        <input type="password" className="form-control" id="password" name="senha" onChange={handleInputChange} minLength={8} placeholder="Digite sua senha" required/>
                        <div className="valid-feedback text-left">Válido.</div>
                        <div className="invalid-feedback text-left">Preencha este campo.</div>
                    </div>
                    {
                        enableSubmitButton === 0
                        ? <button type="submit" className="btn btn-info btn-primary disabled" disabled>Entrar</button>
                        : <button type="submit" className="btn btn-info btn-primary">Entrar</button>
                    }
                    </form> 
                    <Link to="/signUp">
                        <p className="text-info">Ainda não possui cadastro?<br/><u>Crie já o seu</u></p> 
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login;