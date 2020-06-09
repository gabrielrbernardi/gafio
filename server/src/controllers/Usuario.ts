import {Request, Response} from 'express';
import knex from '../database/connection';
import bcrypt from 'bcrypt';

class UsuarioController{
    async index(request: Request, response: Response){
        const users = await knex('usuario').select('*');
        return response.json(users);
    }

    async create(request: Request, response: Response){
        const {nome, email, senha, confirmarSenha, matricula} = request.body;

        if(senha != confirmarSenha){
            return response.json({createdUser: false, error: "Senhas diferentes."});
        }

        // return response.json({nome, email, senha, confirmarSenha, matricula});
        const user = {
            Nome: nome, 
            Email: email, 
            Senha: senha, 
            Matricula: matricula,
            TipoUsuario: 'F',
            isVerified: 0,
        }
        const insertedUser = await knex('usuario').insert(user)
        .then(function(users){
            return response.json({createdUser: true, Nome: user['Nome'], Email: user['Email'], Matricula: user['Matricula'], TipoUsuario: user['TipoUsuario']});
        }).catch(function(err){
            return response.json({createdUser: false, error: err});
        });
    }
}

export default UsuarioController;