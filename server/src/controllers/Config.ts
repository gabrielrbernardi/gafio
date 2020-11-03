import { Request, response, Response } from "express";
import knex from "../database/connection";

class Config {
    async connectionTestFunction(request: Request, response: Response) {
        try {
            await knex("Usuario").count('Nome')
            return response.json({ serverRunning: true })
        } catch (err) {
            return response.json({ serverRunnig: false, error: 'Erro na conexão com o banco de dados.', errorType: err })
        }
    }
}

export default Config;