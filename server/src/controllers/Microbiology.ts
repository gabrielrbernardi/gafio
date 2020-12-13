/*****************************************
| Data: 19/10/2020                                           |
| Resumo: Controlador de Microbiologia (CRUD)
| Sistema: GAFio                                             |
*****************************************/

import { Request, Response } from "express";
import knex from "../database/connection";

import MicrobiologyLog from '../jobs/MicrobiologyLog';

class MicrobiologyController {
    // Método de cadastro
    async create(req: Request, res: Response) {
        const { microbiologyData, email} = req.body;
        const { IdPaciente, IdProntuario } = microbiologyData;

        //Verificação da existência do paciente e do prontuário
        const patientExists = await knex("Paciente").where(
            "SeqPaciente",
            "like",
            `%${IdPaciente}%`
        );
        
        //Verificação da existência do prontuário
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
            //Formatação de datas
            const handleDate = (date: string) => {
                let dateFormated = date.split("T");
                if (dateFormated.length) {
                    dateFormated = dateFormated[0].split("-");
                    date = `${dateFormated[2]}/${dateFormated[1]}/${dateFormated[0]}`;
                }
                return date;
            };

            try {
                microbiologyData.DataColeta = handleDate(microbiologyData.DataColeta);
                microbiologyData.DataResultado = handleDate(microbiologyData.DataResultado);
                const [id] = await knex("Microbiologia").insert(microbiologyData);
                console.log(id);
                MicrobiologyLog.handleSuccessfulCreation(email);
                return res
                    .status(201)
                    .json({ createdMicrobiology: true, ...microbiologyData });
            } catch (error) {
                MicrobiologyLog.handleUnsuccessfulCreation(email, error);
                return res.status(400).json({
                    createdMicrobiology: false,
                    error,
                });
            }
        }
    }

    //Listagem de microbiologia
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
                const [count] = microbiologyLength;
                return res.json({ results, count });
            } else {
                return res
                    .status(400)
                    .json({ error: "Nenhum registro encontrado" });
            }
        } catch (error) {
            return res.json({ error: "Erro ao carregar os registros" });
        }
    }

    //Método para visualização de microbiologia
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

    //Método para atualização de dados
    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { microbiologyData, email } = req.body;
        
        try {
            const { IdPaciente, IdProntuario } = microbiologyData;

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
            
            if (microbiologyData) {
                //Formatação de datas
                const handleDate = (date: string) => {
                    let dateFormated = date.split("T");
                    if (dateFormated.length) {
                        dateFormated = dateFormated[0].split("-");
                        date = `${dateFormated[2]}/${dateFormated[1]}/${dateFormated[0]}`;
                    }
                    return date;
                };   
                
                const microbiology = await knex("Microbiologia").where({
                    IdMicrobiologia: id,
                });

                if (microbiology[0]) {
                    microbiologyData.DataColeta = handleDate(microbiologyData.DataColeta);
                    microbiologyData.DataResultado = handleDate(microbiologyData.DataResultado);

                    await knex("Microbiologia")
                        .update(microbiologyData)
                        .where({ IdMicrobiologia: id });
                
                    MicrobiologyLog.handleSuccessfulUpdate(email, Number(id));
                    return res.json({ updatedMicrobioloogy: true });
                }
                else {
                    MicrobiologyLog.handleUnsuccessfulUpdate(email, 'Microbiologia inexistente', Number(id));
                    return res.status(400).json({
                        updatedMicrobiology: false,
                        error: "Microbiollogia não existe!",
                });                   
                }
            }
        } catch (error) {
            MicrobiologyLog.handleUnsuccessfulUpdate(email, error, Number(id));
            return res.status(400).json({ updatedMicrobioloogy: false, error });
        }
    }

    //Método de exclusão
    async delete(req: Request, res: Response) {
        const { id, email } = req.params;
        try {
            const microbiology = await knex("Microbiologia").where({
                IdMicrobiologia: id,
            });
            if (microbiology[0]) {
                await knex("Microbiologia")
                    .where({ IdMicrobiologia: id })
                    .delete();
                MicrobiologyLog.handleSuccessfulDelete(email, Number(id));
                return res.json({ deletedMicrobiology: true });
            } else {
                MicrobiologyLog.handleUnsuccessfulDelete(email, 'Microbiologia inexistente', Number(id));
                return res.status(400).json({
                    deletedMicrobiology: false,
                    error: "Microbiollogia não existe!",
                });
            }
        } catch (error) {
            MicrobiologyLog.handleUnsuccessfulDelete(email, error, Number(id));
            return res.json({ error });
        }
    }
}

export default new MicrobiologyController();
