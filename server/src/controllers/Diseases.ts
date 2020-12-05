/*************************************
| Resumo: Controlador Doenças (CRUD) |
| Sistema: GAFio                     |
*************************************/

import { Request, Response } from "express";
import knex from "../database/connection";
import axios from "axios";

import DiseasesLog from '../jobs/DiseaseLog';
class DiseasesController {

    // Método para cadastro de uma nova doença:
    async create(request: Request, response: Response) {
        const { codDoenca, nome, email } = request.body;

        if (codDoenca && nome) {
            const diseasesDB = await knex("Doenca").where("codDoenca", codDoenca);

            if (!diseasesDB[0]) {
                await knex("Doenca").insert({
                    codDoenca,
                    nome
                })
                .then(() => {
                    DiseasesLog.handleSuccessfulCreation(email);
                    return response.json({ 
                        createdDisease: true, 
                        diseaseData: { codDoenca, nome } 
                    });
                })
                .catch(err => {
                    DiseasesLog.handleUnsuccessfulCreation(email, err);
                    return response.json({ 
                        createdDisease: false, 
                        error: "Não foi possível inserir a doença no banco de dados.", 
                        err: err 
                    });
                })
            } 
            else {
                return response.json({ 
                    createdDisease: false, 
                    error: "Não foi possível inserir a doença no banco de dados. Código da doença já existente." 
                })
            }
        } 
        else {
            return response.json({ 
                createdDisease: false, 
                error: "Verifique os dados inseridos e tente novamente." 
            });
        }
    }

    // Método para listar doenças por código:
    async indexByCode(request: Request, response: Response) {
        const { code } = request.query;

        let page = String(request.query.page);
        if (!page) page = "10";

        let pageRequest = parseInt(page) / 10;
        const rows = 10;

        const diseasesDB = await knex("Doenca").where("codDoenca", "like", `%${code}%`).offset((pageRequest - 1) * rows).limit(rows);
        const disease = diseasesDB[0];

        if (disease) {
            const diseasesLength = (await knex("Doenca").count("codDoenca").where("codDoenca", 'like', `%${code}%`));

            return response.json({
                diseaseFound: true,
                diseases: diseasesDB,
                length: diseasesLength,
                length1: diseasesDB.length
            });
        } 
        else {
            return response.json({ diseaseFound: false, error: "Doença não encontrada." })
        }
    }

    // Método para listar doenças por nome:
    async indexByName(request: Request, response: Response) {
        const { name } = request.query;

        let page = String(request.query.page);
        if (!page) page = "10";

        let pageRequest = parseInt(page) / 10;
        const rows = 10;

        const diseasesDB = await knex("Doenca").where("nome", "like", `%${name}%`).offset((pageRequest - 1) * rows).limit(rows);
        const disease = diseasesDB[0];

        if (disease) {
            const diseasesLength = (await knex("Doenca").count("codDoenca").where("nome", 'like', `%${name}%`));

            return response.json({
                diseaseFound: true,
                diseases: diseasesDB,
                length: diseasesLength,
                length1: diseasesDB.length
            });
        } 
        else {
            return response.json({ diseaseFound: false, error: "Doença não encontrada." })
        }
    }

    // Método para listar doenças por página
    async indexByPage(request: Request, response: Response) {
        let page = String(request.query.page);

        if (!page) page = "10";

        let pageRequest = parseInt(page) / 10;
        const rows = 10;

        try {
            const diseases = await knex("Doenca").select("*").orderBy('codDoenca', 'desc').offset((pageRequest - 1) * rows).limit(rows);
            const diseasesLength = (await knex("Doenca").select("*")).length;

            return response.json({ 
                showDiseases: true, 
                diseases: diseases, 
                length: diseasesLength 
            });
        } 
        catch (err) {
            return response.json({ 
                showDiseases: false, 
                error: err 
            });
        }
    }

    // Método para pegar informações sobre a doença:
    async diseaseInfo(request: Request, response: Response) {
        
    }

    // Método para atualizar doença:
    async update(request: Request, response: Response) {
        const { id } = request.params;
        const { codDoenca, nome } = request.body;

        if (codDoenca && nome) {
            await knex("Doenca").where("codDoenca", id).update({
                codDoenca,
                nome
            })
            .then(responseDB => {
                if (responseDB === 1) {
                    return response.json({ updatedDisease: true });
                } 
                else {
                    return response.json({ 
                        updatedDisease: false, 
                        error: "Não foi possível alterar os dados da doença." 
                    });
                }
            })
            .catch(err => {
                return response.json({ 
                    updatedDisease: false, 
                    error: "Erro na atualização da doença.", err 
                });
            });
        } 
        else {
            return response.json({ 
                updatedDisease: false, 
                error: "Verifique os dados inseridos e tente novamente." 
            });
        }
    }

    // Método para deletar uma doença:
    async delete(request: Request, response: Response) {
        const { id } = request.params;

        try {
            const disease = await knex("Doenca").where("codDoenca", id);

            if (disease) {
                knex("Doenca").where("codDoenca", id).delete().then(() => {
                    return response.json({ deletedDisease: true });
                });
            } 
            else {
                return response.json({
                    deletedDisease: false,
                    error: "Doença não encontrado.",
                });
            }
        } 
        catch (err) {
            return response.json({ 
                deletedDisease: false, 
                error: err 
            });
        }
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