/****************************************
| Data: 17/06/2020                      |
| Resumo: Controlador Doenças (CRUD)    |
| Sistema: GAFio                        |
****************************************/

import { Request, Response } from "express";
import knex from "../database/connection";
import axios from 'axios';

class DiseasesController {

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
    const diseases = await knex.select("*").from('Doenca');
    return response.json(diseases);
  }

  // Método para listar doenças por nome:
  async indexByName(request: Request, response: Response) {
    const { name } = request.params;
    const filteredDisease = await knex("Doenca").where('Nome', 'like', `%${name}%`);

    console.log(filteredDisease);

    return response.json({ filteredDisease: true, diseases: filteredDisease });
  }

  // Método para listar doenças por código:
  async indexByCode(request: Request, response: Response) {
    const { diseaseCode } = request.params;
    const filteredDisease = await knex("Doenca").where("codDoenca", diseaseCode);

    console.log(filteredDisease);

    return response.json({ filteredDisease: true, diseases: filteredDisease });
  }

  // Método para listar doenças por página
  async indexByPage(request: Request, response: Response) {
    const { page } = request.params;
    const pageRequest = parseInt(page) / 10;
    const rows = 10;
    const diseases = await knex("Doenca").select("*").offset((pageRequest-1) * rows).limit(rows);
    const diseasesLength = (await knex("Doenca").select("*")).length;

    return response.json({ diseases, length: diseasesLength });
  }

  // Método para deletar uma doença:
  async delete(request: Request, response: Response) {
    const { codDoenca } = request.body;
    const disease = await knex("Doenca").where("codDoenca", codDoenca);

    if (disease) {
      await knex("Doenca").where("codDoenca", codDoenca).delete();
      return response.json({ deletedDisease: true });
    }
    else {
      return response.json({
        deletedDisease: false,
        error: "Doença não encontrada.",
      });
    }
  }

  // Método para deletar todo o banco de dados de doenças:
  async deleteAll(request: Request, response: Response) {
    await knex.select("*").from('Doenca').delete();
    return response.json({ deletedAllDisease: true });
  }

  // Método para importar banco de dados de doenças:
  async importDB(request: Request, response: Response) {
    const diseaseAPI = await axios.get("https://cid10-api.herokuapp.com/cid10");
  
    for (let i = 0; i < diseaseAPI.data.length; i++) {
      const codDoenca = diseaseAPI.data[i].codigo;
      const nome = diseaseAPI.data[i].nome;
      
      await knex('Doenca').insert({
        codDoenca,
        nome,
      });
      console.log(`${nome} adicionada.`);
    }
    return response.json({ databaseImported: true });
  }

}

export default DiseasesController;