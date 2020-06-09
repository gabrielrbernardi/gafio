import {Request, Response} from 'express';
import knex from '../database/connection';

class UsuarioController{
    async index(request: Request, response: Response){
        const users = await knex('usuario').select('*');
        return response.json(users);
    }
}

export default UsuarioController;