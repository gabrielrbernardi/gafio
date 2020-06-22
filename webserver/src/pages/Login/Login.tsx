import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import { useCookies } from 'react-cookie';
import jwt from 'jsonwebtoken';

import './login.css';

import loginBanner from '../../assets/fiocruzBanner.jpg';
import api from '../../services/api';

const secretWord = 'PalavraSecreta';

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
    const [cookies, setCookies, removeCookie] = useCookies([]);
  
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

        await api.post('session/login', {email: email, senha: senha})
        .then(function(response){
            if(response.data.userLogin){
                const tokenLoginResponse = jwt.decode(response.data.userToken);
                console.log(tokenLoginResponse)
                var Email = tokenLoginResponse.Email;
                let Nome = tokenLoginResponse.Nome;
                let TipoUsuario = tokenLoginResponse.TipoUsuario;
                let CodUsuario = tokenLoginResponse.CodUsuario;
                console.log(Email);
                setCookiesLogin(Email, Nome, TipoUsuario, CodUsuario);
                history.push('/home');
            }else{
                setResponseDataStatus(2);
                setResponseData(response.data.error);
            }
        })
    }
    
    function setCookiesLogin(email: string, nome: string, tipoUsuario: string, codUsuario: string){
        let nomeArray = nome.split(' ');
        nome = nomeArray[0];
        setCookies('userData', {Email: email, Nome: nome, TipoUsuario: tipoUsuario, CodUsuario: codUsuario});
    }

    useEffect(() => {
        document.title = 'GAFio | Login';
    }, []);

    return (
        <div>
            <div className="row m-5">
                {/* <div className="card ml-5 mt-5"> */}
                    <img className="rounded col-sm-7 " src={loginBanner} alt="Banner"/>
                {/* </div> */}
                <div className="card col-sm-5 p-5 bg-light shadow-lg float-right text-center">
                    <form className="was-validated pb-2" onSubmit={handleSubmit}>
                    {responseDataStatus === 0
                    ? <div></div>
                    : responseDataStatus === 1 
                        ?
                        <div className="alert alert-success alert-dismissible fade show">
                            <p>{responseData}</p>
                        </div>
                        :
                        <div className="alert alert-danger alert-dismissible fade show">
                            <p>{responseData}</p>
                        </div>
                    }
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" className="form-control" id="email" name="email" onChange={handleInputChange} placeholder="Digite seu email" required autoFocus/>
                        <div className="valid-feedback text-left">Válido.</div>
                        <div className="invalid-feedback text-left">Preencha este campo.</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha:</label>
                        <input type="password" className="form-control" id="password" name="senha" onChange={handleInputChange} placeholder="Digite sua senha" required/>
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