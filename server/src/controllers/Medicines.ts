
/******************************************
| Resumo: Controlador Medicamentos (CRUD) |
| Sistema: GAFio                          |
******************************************/

import {Request, Response} from "express";
import knex from "../database/connection";
import DiseaseLog from "../jobs/DiseaseLog";

import MedicineLog from '../jobs/MedicineLog';

class MedicinesController {
    async create(request: Request, response: Response) {
        const {
            EAN,
            PrincipioAtivo,
            CNPJ,
            Laboratorio,
            Registro,
            Produto,
            Apresentacao,
            ClasseTerapeutica,
            email
        } = request.body;

        if (EAN && PrincipioAtivo && CNPJ && Laboratorio && Registro && Produto && Apresentacao && ClasseTerapeutica) {
            const medicinesDB = await knex("Medicamentos").where("EAN", EAN);

            if (!medicinesDB[0]) {
                await knex("Medicamentos").insert({
                    EAN,
                    PrincipioAtivo,
                    CNPJ,
                    Laboratorio,
                    Registro,
                    Produto,
                    Apresentacao,
                    ClasseTerapeutica
                })
                    .then(() => {
                    MedicineLog.handleSuccessfulCreation(email)
                    return response.json({ 
                        createdMedicine: true, 
                        medicineData: {
                            EAN,
                            PrincipioAtivo,
                            CNPJ,
                            Laboratorio,
                            Registro,
                            Produto,
                            Apresentacao,
                            ClasseTerapeutica
                        } 
                    });
                })
                    .catch(err => {
                        MedicineLog.handleUnsuccessfulCreation(email, err);
                        return response.json({ 
                        createdMedicine: false, 
                        error: "Não foi possível inserir o medicamento no banco de dados.", 
                        err: err 
                    });
                })
            } 
            else {
                MedicineLog.handleUnsuccessfulCreation(email, "EAN existente");
                return response.json({ 
                    createdMedicine: false, 
                    error: "Não foi possível inserir o medicamento no banco de dados. EAN do medicamento já existente." 
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

    async indexByEan(request: Request, response: Response) {
        const { ean } = request.query;

        let page = String(request.query.page);
        if (!page) page = "10";

        let pageRequest = parseInt(page) / 10;
        const rows = 10;

        const medicinesDB = await knex("Medicamentos").where("EAN", "like", `%${ean}%`).offset((pageRequest - 1) * rows).limit(rows);
        const medicine = medicinesDB[0];

        if (medicine) {
            const medicinesLength = (await knex("Medicamentos").count("EAN").where("EAN", "like", `%${ean}%`));

            return response.json({
                medicineFound: true,
                medicines: medicinesDB,
                length: medicinesLength,
                length1: medicinesDB.length
            });
        } 
        else {
            return response.json({ medicinesFound: false, error: "Medicamento não encontrada." })
        }
    }

    async indexByClass(request: Request, response: Response) {
        const { medicineClass } = request.query;

        let page = String(request.query.page);
        if (!page) page = "10";

        let pageRequest = parseInt(page) / 10;
        const rows = 10;

        const medicinesDB = await knex("Medicamentos").where("ClasseTerapeutica", "like", `%${medicineClass}%`).offset((pageRequest - 1) * rows).limit(rows);
        const medicine = medicinesDB[0];

        if (medicine) {
            const medicinesLength = (await knex("Medicamentos").count("EAN").where("ClasseTerapeutica", "like", `%${medicineClass}%`));

            return response.json({
                medicineFound: true,
                medicines: medicinesDB,
                length: medicinesLength,
                length1: medicinesDB.length
            });
        } 
        else {
            return response.json({ medicinesFound: false, error: "Medicamento não encontrada." })
        }
    }

    async indexByPrinciple(request: Request, response: Response) {
        const { principle } = request.query;

        let page = String(request.query.page);
        if (!page) page = "10";

        let pageRequest = parseInt(page) / 10;
        const rows = 10;

        const medicinesDB = await knex("Medicamentos").where("PrincipioAtivo", "like", `%${principle}%`).offset((pageRequest - 1) * rows).limit(rows);
        const medicine = medicinesDB[0];

        if (medicine) {
            const medicinesLength = (await knex("Medicamentos").count("EAN").where("PrincipioAtivo", "like", `%${principle}%`));

            return response.json({
                medicineFound: true,
                medicines: medicinesDB,
                length: medicinesLength,
                length1: medicinesDB.length
            });
        } 
        else {
            return response.json({ medicinesFound: false, error: "Medicamento não encontrada." })
        }
    }

    async indexByPage(request: Request, response: Response) {
        let page = String(request.query.page);

        if (!page) page = "10";

        let pageRequest = parseInt(page) / 10;
        const rows = 10;

        try {
            const medicines = await knex("Medicamentos").select("*").orderBy("ean", "desc").offset((pageRequest - 1) * rows).limit(rows);
            const medicinesLength = (await knex("Medicamentos").select("*")).length;

            return response.json({ 
                showmedicines: true, 
                medicines: medicines, 
                length: medicinesLength 
            });
        } 
        catch (err) {
            return response.json({ 
                showMedicines: false, 
                error: err 
            });
        }
    }

    // Método para atualizar medicamento:
    async update(request: Request, response: Response) {
        const { id } = request.params;
        const {
            EAN,
            PrincipioAtivo,
            CNPJ,
            Laboratorio,
            Registro,
            Produto,
            Apresentacao,
            ClasseTerapeutica
        } = request.body;

        if (EAN && PrincipioAtivo && CNPJ && Laboratorio && Registro && Produto && Apresentacao && ClasseTerapeutica) {
            await knex("Medicamentos").where("EAN", id).update({
                EAN,
                PrincipioAtivo,
                CNPJ,
                Laboratorio,
                Registro,
                Produto,
                Apresentacao,
                ClasseTerapeutica
            })
            .then(responseDB => {
                if (responseDB === 1) {
                    return response.json({ updatedMedicine: true });
                } 
                else {
                    return response.json({ 
                        updatedMedicine: false, 
                        error: "Não foi possível alterar os dados do medicamento." 
                    });
                }
            })
            .catch(err => {
                return response.json({ 
                    updatedDisease: false, 
                    error: "Erro na atualização do medicamento.", err 
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

    async delete(request: Request, response: Response) {
        const { id } = request.params;

        try {
            const medicine = await knex("Medicamentos").where("EAN", id);

            if (medicine) {
                knex("Medicamentos").where("EAN", id).delete().then(() => {
                    return response.json({ deletedMedicine: true });
                });
            } 
            else {
                return response.json({
                    deletedMedicine: false,
                    error: "Medicamento não encontrado.",
                });
            }
        } 
        catch (err) {
            return response.json({ 
                deletedMedicine: false, 
                error: err 
            });
        }
    }
  }


export default MedicinesController;
