/****************************************
| Data: 12/06/2020                      |
| Resumo: Controlador Login             |
| Sistema: GAFio                        |
****************************************/

import {Request, Response} from 'express';
import knex from '../database/connection';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secretWord = 'PalavraSecreta';

declare module "jsonwebtoken"{
    export function decode(
        token: string
    ): {nome: string, email: string, senha: string, confirmarSenha: string, matricula: string};
}

class UserSession{
    async login(request: Request, response: Response){
        // const {email, senha} = request.body;
        const {token} = request.body;
        var decoded = jwt.decode(token);
        const email = decoded.email;
        const senha = decoded.senha;
        console.log(email);
        console.log(senha);
        const userDB = await knex('Usuario').where('Email', email);
        const user = userDB[0];
        if(user){
            bcrypt.compare(senha, user['Senha'], function(err, result) {
                if(result){
                    const token = jwt.sign({Email: user['Email'], Nome: user['Nome'], TipoUsuario: user['TipoUsuario']}, secretWord, {expiresIn: 60*60})  //Expira em 1 hora
                    return response.json({userLogin: true, userToken: token});
                }else{
                    return response.json({userLogin: false, error: 'Senha incorreta.'});
                }
            });
        }else{
            return response.json({userLogin: false, error: 'Email não encontrado.'});
        }
    }

    async requestUpdateUserType(request: Request, response: Response){
        const {email, senha} = request.body;
        const userDB = await knex('Usuario').where('Email', email);
        const user = userDB[0];
        if(user){
            bcrypt.compare(senha, user['Senha'], function(err, result) {
                if(result){
                    return response.json({updatedType: true});
                }else{
                    return response.json({updatedType: false, error: 'Senha incorreta.'})
                }
            });
        }else{
            return response.json({updatedType: false, error: 'Email não encontrado.'})
        }
    }
}

export default UserSession;