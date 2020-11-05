/*****************************************
| Data: 19/10/2020                                           |
| Resumo: Controlador de Microbiologia (CRUD)
| Sistema: GAFio                                             |
*****************************************/

import { Request, Response } from "express";
import knex from "../database/connection";

class MicrobiologyController {
    // Método de cadastro
    async create(req: Request, res: Response) {
        const { IdPaciente, IdProntuario } = req.body;

        //verificação da existência do paciente e do prontuário
        const patientExists = await knex("Paciente").where(
            "SeqPaciente",
            "like",
            `%${IdPaciente}%`
        );

        const medicalRecordsExists = await knex("Prontuario").where(
            "SeqProntuario",
            "like",
            `%${IdProntuario}%`
        );

        if (!(patientExists[0] && medicalRecordsExists[0])) {
            return res.status(400).json({
                createdMicrobiology: false,
                error: "Paciente ou prontuário não corresponde.",
            });
        } else {
            try {
                await knex("Microbiologia").insert(req.body);
                return res
                    .status(201)
                    .json({ createdMicrobiology: true, ...req.body });
            } catch (error) {
                return res.status(400).json({
                    createdMicrobiology: false,
                    error,
                });
            }
        }
    }

    //Método de listagem de dados para a tabela do dashboard
    async index(req: Request, res: Response) {
        try {
            const { page = 1 } = req.query;
            const { filter } = req.query;
            const pageRequest = Number(page);
            const rows = 10;
            let microbiologyLength;

            const query = knex("Microbiologia");

            //Filtragem de dados
            if (filter) {
                const { filterValue } = req.query;
                if (filter === "id") {
                    microbiologyLength = await knex("Microbiologia")
                        .where({ IdMicrobiologia: filterValue })
                        .count({
                            count: "*",
                        });
                    query.where({ IdMicrobiologia: filterValue });
                } else if (filter === "paciente") {
                    microbiologyLength = await knex("Microbiologia")
                        .where({ IdPaciente: filterValue })
                        .count({
                            count: "*",
                        });
                    query.where({ IdPaciente: filterValue });
                } else if (filter === "prontuario") {
                    microbiologyLength = await knex("Microbiologia")
                        .where({ IdProntuario: filterValue })
                        .count({
                            count: "*",
                        });
                    query.where({ IdProntuario: filterValue });
                } else if (filter === "dataColeta") {
                    microbiologyLength = await knex("Microbiologia")
                        .where({ DataColeta: filterValue })
                        .count({
                            count: "*",
                        });
                    query.where({ DataColeta: filterValue });
                } else {
                    query.where({ DataResultado: filterValue });
                    microbiologyLength = await knex("Microbiologia")
                        .where({ DataResultado: filterValue })
                        .count({
                            count: "*",
                        });
                }
            } else {
                microbiologyLength = await knex("Microbiologia").count({
                    count: "*",
                });
            }

            const results = await query
                .limit(rows)
                .offset((pageRequest - 1) * rows);

            if (results.length) {
                //formatação de datas
                results.forEach((result: any) => {
                    let dataColeta = result.DataColeta.split("T");
                    let dataResultado = result.DataResultado.split("T");

                    dataColeta = dataColeta[0].split("-");
                    dataResultado = dataResultado[0].split("-");

                    result.DataColeta = `${dataColeta[2]}/${dataColeta[1]}/${dataColeta[0]}`;
                    result.DataResultado = `${dataResultado[2]}/${dataResultado[1]}/${dataResultado[0]}`;
                });

                const [count] = microbiologyLength;
                return res.json({ results, count });
            } else {
                return res.status(400).json({ error: "Nenhum registro encontrado" });
            }
        } catch (error) {
            return res.json({ error: "Erro ao carregar os registros" });
        }
    }

     //método para visualização
    async view(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const microbiology = await knex("Microbiologia")
                .where({ IdMicrobiologia: id })
                .join(
                    "Prontuario",
                    "Prontuario.SeqProntuario",
                    "=",
                    "Microbiologia.IdProntuario"
                )
                .join(
                    "Paciente",
                    "Paciente.SeqPaciente",
                    "=",
                    "Microbiologia.IdPaciente"
                )
                .select(
                    "Microbiologia.*",
                    "Prontuario.NroProntuario",
                    "Paciente.NomePaciente",
                    "Paciente.NroPaciente"
                );

            return res.json(microbiology);
        } catch (error) {
            return res.json({
                error: "Erro ao carregar os dados",
            });
        }
    }

    //Método de recuperação de dados para atualização de microbiologia no frontend
    async showById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const microbiology = await knex("Microbiologia").where({
                IdMicrobiologia: id,
            });
            if (!microbiology[0]) {
                return res.status(400).json({
                    error: "Microbiologia não existe!",
                });
            }
            return res.json(microbiology);
        } catch (error) {
            return res.json({ error: "Erro ao carregar os dados" });
        }
    }

    //método para atualização de dados
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { IdPaciente, IdProntuario } = req.body;
            if (IdPaciente) {
                const patientExists = await knex("Paciente").where(
                    "SeqPaciente",
                    "like",
                    `%${IdPaciente}%`
                );
                if (!patientExists[0]) {
                    return res.status(400).json({
                        createdMicrobiology: false,
                        error: "Paciente não existe!",
                    });
                }
            }

            if (IdProntuario) {
                const medicalRecordsExists = await knex("Prontuario").where(
                    "SeqProntuario",
                    "like",
                    `%${IdProntuario}%`
                );
                if (!medicalRecordsExists[0]) {
                    return res.status(400).json({
                        createdMicrobiology: false,
                        error: "Prontuário não existe!",
                    });
                }
            }

            await knex("Microbiologia")
                .update(req.body)
                .where({ IdMicrobiologia: id });

            return res.json({ updatedMicrobioloogy: true });
        } catch (error) {
            return res.status(400).json({ updatedMicrobioloogy: false, error });
        }
    }

    //Método de exclusão
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const microbiology = await knex("Microbiologia").where({
                IdMicrobiologia: id,
            });
            if (microbiology[0]) {
                await knex("Microbiologia")
                    .where({ IdMicrobiologia: id })
                    .delete();
                return res.json({ deletedMicrobiology: true });
            } else {
                return res.status(400).json({
                    deletedMicrobiology: false,
                    error: "Microbiollogia não existe!",
                });
            }
        } catch (error) {
            return res.json({ error });
        }
    }
}

export default new MicrobiologyController();
