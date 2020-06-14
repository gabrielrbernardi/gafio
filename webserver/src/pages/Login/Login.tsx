import React, {useState, ChangeEvent, FormEvent} from 'react';
import {Link} from 'react-router-dom';
// import axios from 'axios';

import jwt from 'jsonwebtoken';

import './login.css';

import loginBanner from '../../assets/fiocruzBanner.jpg';
import api from '../../services/api';

const secretWord = 'PalavraSecreta';


const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        senha: '',
    });

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target
        setFormData({...formData, [name]: value})
    }
    
    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        const {email, senha} = formData;
        
        const token = jwt.sign({email: email, senha: senha}, secretWord);

        await api.post('session/login', {token: token})
        .then(function(response){
            console.log(response)
        })
    }

    return (
        <div>
            <div className="row m-5">
                {/* <div className="card ml-5 mt-5"> */}
                    <img className="rounded col-sm-7 " src={loginBanner} alt="Banner"/>
                {/* </div> */}
                <div className="card col-sm-5 p-5 bg-light shadow-lg float-right text-center">
                    <form className="was-validated" onSubmit={handleSubmit}>
                        <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="text" className="form-control" id="email" name="email" onChange={handleInputChange} placeholder="Digite seu email" required/>
                        <div className="valid-feedback text-left">Válido.</div>
                        <div className="invalid-feedback text-left">Preencha este campo.</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha:</label>
                        <input type="password" className="form-control" id="password" name="senha" onChange={handleInputChange} placeholder="Digite sua senha" required/>
                        <div className="valid-feedback text-left">Válido.</div>
                        <div className="invalid-feedback text-left">Preencha este campo.</div>
                    </div>
                    <button type="submit" className="btn btn-info btn-primary">Entrar</button><br/>
                </form> 
                <Link to="/signUp">
                    <a className="text-info">Ainda não possui cadastro?<br/><u>Crie já o seu</u></a> 
                </Link>
                </div>
            </div>
        </div>
    )
}

export default Login;