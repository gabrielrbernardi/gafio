import {Request, Response, request} from 'express';
import knex from '../database/connection';
import bcrypt from 'bcrypt';

const saltRounds = 10;

class UsuarioController{
    async create(request: Request, response: Response){     //Criacao de usuario
        const {nome, email, senha, confirmarSenha, matricula} = request.body;

        if(!nome || !email || !senha || !confirmarSenha || !matricula){
            return response.json({createdUser: false, error: 'Preencha todos os campos.'});
        }
        if(senha != confirmarSenha){
            return response.json({createdUser: false, error: "Senhas diferentes."});
        }

        const userDB = await knex('usuario').where('Email', email);
        const user = userDB[0];
        if(!user){
            await bcrypt.hash(senha, saltRounds, function(err, hash){
                const user = {
                    Nome: nome, 
                    Email: email, 
                    Senha: hash, 
                    Matricula: matricula,
                    TipoUsuario: 'F',
                    isVerified: 0,
                }
                const insertedUser = knex('usuario').insert(user)
                .then(function(users){
                    return response.json({createdUser: true, id: users[0], Nome: user['Nome'], Email: user['Email'], Matricula: user['Matricula'], TipoUsuario: user['TipoUsuario']});
                }).catch(function(err){
                    return response.json({createdUser: false, error: err});
                });
            })
        }else{
            return response.json({createdUser: false, error: 'Email já existente.'});
        }
    }

    async index(request: Request, response: Response){      //Listagem de todos usuarios
        const users = await knex('usuario').select('*');
        return response.json(users);
    }

    async show(request: Request, response: Response){       //Listagem de usuario especifico
        const {id} = request.params;
        const userDB = await knex('usuario').where('CodUsuario', id);
        const user = userDB[0];
        console.log(user);
        if(user){
            return response.json({userFound: true, id: user['CodUsuario'], Nome: user['Nome'], Email: user['Email'], Matricula: user['Matricula'], TipoUsuario: user['TipoUsuario']});
        }else{
            return response.json({userFound: false, error: 'Usuario não encontrado. Verifique o id e tente novamente.'});
        }
    }

    async delete(request: Request, response: Response){
        const {email, senha} = request.body;
        const userDB = await knex('usuario').where('Email', email);
        
        const user = userDB[0];
        if(user){
            await knex('usuario').where('Email', email).del();
            return response.json({deletedUser: true});
        }else{
            return response.json({deletedUser: false, error: 'Usuario não encontrado.'});
        }        
    }
}

export default UsuarioController;