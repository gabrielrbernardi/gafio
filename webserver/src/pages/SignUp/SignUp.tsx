import React, {useState, ChangeEvent, FormEvent} from 'react';
import {Link, useHistory} from 'react-router-dom';
import jwt from 'jsonwebtoken';

import '../Login/login.css';

import api from '../../services/api';

const secretWord = 'PalavraSecreta';

const SignUp = () => {
    const history = useHistory();
    
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        matricula: '',
    });

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target
        setFormData({...formData, [name]: value})
    }
    
    function handleSubmit(event: FormEvent){
        event.preventDefault();
        const {nome, email, senha, confirmarSenha, matricula} = formData;
        console.log(nome);
        console.log(email);
        console.log(senha);
        console.log(confirmarSenha);
        console.log(matricula);
        
        
        const token = jwt.sign({nome: nome, email: email, senha: senha, confirmarSenha: confirmarSenha, matricula: matricula}, secretWord);
        api.post('users', {token: token})
        .then(function(response){
            if(response.data.createdUser){
                alert('Usuario Criado');
            }else{
                alert(response.data.error);
            }
        })
 
        // history.push('/');
    }

    return (
        <div className="row m-5">
            <div className="card shadow-lg p-3 col-sm-6 offset-md-3 border">
                <a className="text-dark h3 text-center">Cadastro de Usuário</a>
                <form className="was-validated" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nome">Nome Completo:</label>
                    <input type="text" className="form-control" id="nome" name="nome" onChange={handleInputChange} placeholder="Digite seu nome" required/>
                    <div className="m-4"></div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" className="form-control" id="email" name="email" onChange={handleInputChange} placeholder="Digite seu email" required/>
                    <div className="m-4"></div>
                    <label htmlFor="senha">Senha:</label>
                    <input type="password" className="form-control" id="senha" name="senha" onChange={handleInputChange} placeholder="Digite sua senha" required/>
                    <div className="m-4"></div>
                    <label htmlFor="confirmarSenha">Confirmar Senha:</label>
                    <input type="password" className="form-control" id="confirmarSenha" name="confirmarSenha" onChange={handleInputChange} placeholder="Confirme sua senha" required/>
                    <div className="m-4"></div>
                    <label htmlFor="matricula">Matrícula:</label>
                    <input type="password" className="form-control" id="matricula" name="matricula" onChange={handleInputChange} placeholder="Confirme sua senha" required/>
                </div>
                <button type="submit" className="btn btn-info btn-primary">Entrar</button><br/>
                </form>
            </div>
        </div>
    )
}

export default SignUp;