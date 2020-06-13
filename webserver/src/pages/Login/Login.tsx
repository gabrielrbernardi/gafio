import React from 'react';
import {Link} from 'react-router-dom';

import './login.css';

import loginBanner from '../../assets/fiocruzBanner.jpg';

const Login = () => {
    return (
        <div>
            <div className="row m-5">
                {/* <div className="card ml-5 mt-5"> */}
                    <img className="rounded col-sm-7 " src={loginBanner} alt="Banner"/>
                {/* </div> */}
                <div className="card col-sm-5 p-5 bg-light shadow-lg float-right text-center">
                    <form className="was-validated">
                        <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="text" className="form-control" id="email" placeholder="Digite seu email" name="email" required/>
                        <div className="valid-feedback text-left">Válido.</div>
                        <div className="invalid-feedback text-left">Preencha este campo.</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha:</label>
                        <input type="password" className="form-control" id="password" placeholder="Digite sua senha" name="password" required/>
                        <div className="valid-feedback text-left">Válido.</div>
                        <div className="invalid-feedback text-left">Preencha este campo.</div>
                    </div>
                    <a href="#" className="btn btn-info btn-primary" role="button">Entrar</a><br/>
                    <Link to="/signUp">
                        <a className="text-info">Ainda não possui cadastro?<br/><u>Crie já o seu</u></a> 
                    </Link>
                </form> 
                </div>
            </div>
        </div>
    )
}

export default Login;