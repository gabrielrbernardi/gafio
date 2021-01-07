/*****************************************
| Data: 19/10/2020                                           |
| Resumo: Controlador de Microbiologia (CRUD)
| Sistema: GAFio                                             |
*****************************************/

import { Request, Response } from "express";
import knex from "../database/connection";

import MicrobiologyLog from '../jobs/MicrobiologyLog';

class MicrobiologyController {
    /**
     * Adiciona uma microbiologia no banco de dados
     *
     * @param microbiologyData
     * @param email
     * @return json
     */
    async create(req: Request, res: Response) {
        const { microbiologyData, email } = req.body;
        const { IdPaciente, IdProntuario } = microbiologyData;

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

        //Verificação da existência do paciente e do prontuário
        if (!(patientExists[0] && medicalRecordsExists[0])) {
            return res.status(400).json({
                createdMicrobiology: false,
                error: "Paciente ou prontuário não corresponde.",
            });
        }
        //Fim da verificação da existência do prontuário ou paciente
        else {
            // Formatação de datas
            const handleDate = (date: string) => {
                let dateFormated = date.split("T");
                if (dateFormated.length) {
                    dateFormated = dateFormated[0].split("-");
                    date = `${dateFormated[2]}/${dateFormated[1]}/${dateFormated[0]}`;
                }
                return date;
            };

            try {
                microbiologyData.DataColeta = handleDate(
                    microbiologyData.DataColeta
                );

                if (microbiologyData.DataResultado)
                    microbiologyData.DataResultado = handleDate(
                        microbiologyData.DataResultado
                    );

                //Persiste a microbiologia no banco de dados
                await knex("Microbiologia").insert(microbiologyData);

                MicrobiologyLog.handleSuccessfulCreation(email);

                return res
                    .status(201)
                    .json({ createdMicrobiology: true, ...microbiologyData });
            } catch (error) {
                //Erro ao persistir a microbiologia
                MicrobiologyLog.handleUnsuccessfulCreation(email, error);

                return res.status(400).json({
                    createdMicrobiology: false,
                    error,
                });
            }
        }
    }

    /**
     * Listagem  de microbiologia(s)
     *
     * @param page
     * @param filter
     * @param filterValue
     * @return microbiologies
     * @return count
     */
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
                //Lista todas as microbiologias, sem filtrar
                microbiologyLength = await knex("Microbiologia").count({
                    count: "*",
                });
            }

            //Busca a(s) microbiologia(s), com limite de 10 microbiologia  por página
            const results = await query
                .limit(rows)
                .offset((pageRequest - 1) * rows);

            if (results.length) {
                //retorna todos as microbiologias encontradas
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

    /**
     * Busca uma microbiologia por id, devolvendo os dados da mesma juntamente com os dados
     * do prontuário e paciente para mostrar os dados na visualização
     *
     * @param id
     * @return microbiology
     */
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

    /**
     * Busca uma microbiologia por id
     *
     * @param id
     * @return microbiology
     */
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

    /**
     * Atualiza uma microbiologia
     *
     * @param id
     * @param email
     * @param microbiologyData
     * @return json
     */
    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { microbiologyData, email } = req.body;

        try {
            const { IdPaciente, IdProntuario } = microbiologyData;

            //Verificação da existência do paciente
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

            //Verificação da existência do prontuário
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

                //Busca a microbiologia pelo id
                const microbiology = await knex("Microbiologia").where({
                    IdMicrobiologia: id,
                });

                //Verifica a existência da microbiologia
                if (microbiology[0]) {
                    microbiologyData.DataColeta = handleDate(
                        microbiologyData.DataColeta
                    );
                    microbiologyData.DataResultado = handleDate(
                        microbiologyData.DataResultado
                    );

                    //Atualiza  a microbiologia
                    await knex("Microbiologia")
                        .update(microbiologyData)
                        .where({ IdMicrobiologia: id });

                    MicrobiologyLog.handleSuccessfulUpdate(email, Number(id));
                    return res.json({ updatedMicrobioloogy: true });
                } else {
                    MicrobiologyLog.handleUnsuccessfulUpdate(
                        email,
                        "Microbiologia inexistente",
                        Number(id)
                    );
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

    /**
     * Exclui uma microbiologia por id
     *
     * @param id
     * @param email
     * @return json
     */
    async delete(req: Request, res: Response) {
        const { id, email } = req.params;
        try {
            const microbiology = await knex("Microbiologia").where({
                IdMicrobiologia: id,
            });
            //Verifica a existência da microbiologia
            if (microbiology[0]) {
                //Deleta a microbiologia
                await knex("Microbiologia")
                    .where({ IdMicrobiologia: id })
                    .delete();
                MicrobiologyLog.handleSuccessfulDelete(email, Number(id));
                return res.json({ deletedMicrobiology: true });
            } else {
                MicrobiologyLog.handleUnsuccessfulDelete(
                    email,
                    "Microbiologia inexistente",
                    Number(id)
                );
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
