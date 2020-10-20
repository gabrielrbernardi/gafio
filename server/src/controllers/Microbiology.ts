/*****************************************
| Data: 19/10/2020                                           |
| Resumo: Controlador de Microbiologia (CRUD)
| Sistema: GAFio                                             |
*****************************************/

import { Request, Response } from "express";
import knex from "../database/connection";

class MicrobiologyController {
    // Método para cadastro
    async create(req: Request, res: Response) {
        const {
            IdPaciente,
            IdProntuario,
        } = req.body;

        //verificação da existência do paciente e do prontuário
        const patientExists = await knex("Usuario").where(
            "CodUsuario",
            "like",
            `%${IdPaciente}%`
        );

        const medicalRecordsExists = await knex("Prontuario").where(
            "SeqProntuario",
            "like",
            `%${IdProntuario}%`
        );

        if (!(patientExists[0]  && medicalRecordsExists[0])) {
            return res.status(400).json({
                createdMicrobiology: false,
                message: "Paciente ou prontuário não corresponde.",
            });
        } else {
            try {
                await knex("Microbiologia").insert(req.body);
                return res.json({ createdMicrobiology: true, ...req.body });
            } catch (error) {
                return res.status(400).json({
                    createdMicrobiology: false,
                    message: "Erro ao criar.",
                });
            }
        }
    }
}

export default new MicrobiologyController();
