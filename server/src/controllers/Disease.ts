/****************************************
| Data: 17/06/2020                      |
| Resumo: Controlador Doenças (CRUD)    |
| Sistema: GAFio                        |
****************************************/

import { Request, Response } from 'express';
import knex from '../database/connection';

class DiseaseController {

  // Método para cadastro de uma nova doença:
  async create(request: Request, response: Response) {
    const { codDoenca, nome } = request.body;

    await knex("Doenca").insert({
      codDoenca,
      nome,
    });

    return response.json({ codDoenca, nome });
  }

  // Método para listar doenças:
  async index(request: Request, response: Response) {
    const diseases = await knex("Doenca").select("*");
    
    return response.json(diseases);
  }

  // Método para deletar uma doença:
  async delete(request: Request, response: Response) {
    const { codDoenca } = request.body;
    const disease = await knex('Doenca').where('codDoenca', codDoenca);

    if (disease) {
      await knex("Doenca").where("codDoenca", codDoenca).delete();
      return response.json({ deletedDisease: true });
    }
    else {
      return response.json({ deletedDisease: false, error: 'Doença não encontrado.' });
    }
  } 
}

export default DiseaseController;