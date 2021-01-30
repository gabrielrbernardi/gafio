/*****************************************
| Data: 19/10/2020                                           |
| Resumo: Controlador de Microbiologia (CRUD)
| Sistema: GAFio                                             |
*****************************************/

import { Request, response, Response } from "express";
import knex from "../database/connection";

import MicrobiologyLog from "../jobs/MicrobiologyLog";
import { IMicrobiology } from "../interfaces/MicrobiologyInterface";
import MicrobiologyServiceImpl from "../services/impl/MicrobiologyServiceImpl";
import DateUtils from "../utils/DateUtils";

interface IRequest {
  microbiologyData: IMicrobiology;
  email: string;
}

class MicrobiologyController {

  /**
     * Adiciona uma nova microbiologia no banco de dados
     *
     * @param microbiologyData
     * @param email
     * @returns uma microbiologia do tipo IMicrobiology ou um json com o erro
  */
  async create(req: Request, res: Response) {
    const { microbiologyData, email }: IRequest = req.body;
    const { IdPaciente, IdProntuario } = microbiologyData;

    const [patientExists] = await knex("Paciente").where({ SeqPaciente: IdPaciente });
    if (!patientExists)
      return res.status(400).json({ createdMicrobiology: false, error: "Paciente inexistente." });

    const [medicalRecordsExists] = await knex("Prontuario").where({ SeqProntuario: IdProntuario });
    if (!medicalRecordsExists)
      return res.status(400).json({ createdMicrobiology: false, error: "Prontuário inexistente." });

    try {
      microbiologyData.DataColeta =  DateUtils.handleDate(microbiologyData.DataColeta);

      if (microbiologyData.DataResultado)
      microbiologyData.DataResultado = DateUtils.handleDate(microbiologyData.DataResultado);

      MicrobiologyServiceImpl.create(microbiologyData);
      MicrobiologyLog.handleSuccessfulCreation(email);

      return res.status(201).json({
        createdMicrobiology: true,
        ...microbiologyData
      });
    } catch (error) {
      MicrobiologyLog.handleUnsuccessfulCreation(email, error);

      return res.status(400).json({ createdMicrobiology: false, error });
    }
  }

  /**
     * Listagem  de microbiologia(s)
     *
     * @param page
     * @param filter
     * @param filterValue
     * @returns retorna uma lista de IMicrobiology ou um json com o erro
  */
  async index(req: Request, res: Response) {
    try {
      const {page = 1} = req.query;
      const { filter } = req.query;
      const pageRequest = Number(page);
      const rows = 10;
      let response;

      // Filtragem de dados
      if (filter) {
        const { filterValue } = req.query;
          
        if (filter === "id") {
            const result = await MicrobiologyServiceImpl.findById(Number(filterValue));
            result ? response = { results: [result], count: {count: 1} }:undefined;
        } else if (filter === "paciente") {
            response = await MicrobiologyServiceImpl.findByIdPaciente(Number(filterValue), { page: pageRequest,  rows });
        } else if (filter === "prontuario") {
            response = await MicrobiologyServiceImpl.findByIdProntuario(Number(filterValue), { page: pageRequest,  rows });
        } else if (filter === "dataColeta") {
            response = await MicrobiologyServiceImpl.findByDataColeta(String(filterValue), { page: pageRequest,  rows });
        } else { 
           response = await MicrobiologyServiceImpl.findByDataResultado(String(filterValue), { page: pageRequest,  rows });
        }
      } else {
          response = await MicrobiologyServiceImpl.index({ page: pageRequest,  rows });
      }

      if (response?.results.length) {
        return res.json(response);
      } else {
        return res.status(400).json({ error: "Nenhum registro encontrado" });
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
     * @returns uma microbiologia com dados do paciente e prontuário ou um json com o erro
  */
  async view(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const microbiology = await MicrobiologyServiceImpl.show(Number(id));
      
      return res.json(microbiology);
    } catch (error) {
      return res.json({ error: "Erro ao carregar os dados" });
    }
  }

  /**
     * Busca uma microbiologia por id
     *
     * @param id
     * @returns uma IMicrobiology ou um json com o erro
  */
  async showById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const microbiology = await MicrobiologyServiceImpl.findById(Number(id));
      if (microbiology)
        return res.json(microbiology);
      else
        return res.status(400).json({ error: "Microbiologia  inexistente!" });
    } catch (err) {
      return res.json({ error: "Erro ao carregar os dados" });
    }
  }

  /**
     * Atualiza uma microbiologia
     *
     * @param id
     * @param email
     * @param microbiologyData
     * @returns um json com o status da atualização
  */
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { microbiologyData, email }: IRequest = req.body;

    try {
      const { IdPaciente, IdProntuario } = microbiologyData;

      const [patientExists] = await knex("Paciente").where({ SeqPaciente: IdPaciente });
      if (!patientExists)
        return res.status(400).json({ createdMicrobiology: false, error: "Paciente inexistente." });

      const [medicalRecordsExists] = await knex("Prontuario").where({ SeqProntuario: IdProntuario });
      if (!medicalRecordsExists)
        return res.status(400).json({ createdMicrobiology: false, error: "Prontuário inexistente." });

      if (microbiologyData) {
        const microbiology = await MicrobiologyServiceImpl.findById(Number(id));

        if (microbiology) {
          microbiologyData.DataColeta = DateUtils.handleDate(microbiologyData.DataColeta);
          microbiologyData.DataResultado = DateUtils.handleDate(microbiologyData.DataResultado);

          await MicrobiologyServiceImpl.update(Number(id), microbiologyData);
          MicrobiologyLog.handleSuccessfulUpdate(email, Number(id));

          return res.json({ updatedMicrobioloogy: true });
        } else {
          MicrobiologyLog.handleUnsuccessfulUpdate(email, "Microbiologia inexistente", Number(id));
          return res.status(400).json({ updatedMicrobiology: false, error: "Microbiologia inexistente!" });
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
     * @returns um json com status da exclusão
  */
  async delete(req: Request, res: Response) {
    const { id, email } = req.params;

    try {
      const microbiology = await MicrobiologyServiceImpl.findById(Number(id));

      if (microbiology) {
        await MicrobiologyServiceImpl.delete(Number(id));
        MicrobiologyLog.handleSuccessfulDelete(email, Number(id));

        return res.json({ deletedMicrobiology: true });
      } else {
        MicrobiologyLog.handleUnsuccessfulDelete(email, "Microbiologia inexistente", Number(id));
        return res.status(400).json({ deletedMicrobiology: false, error: "Microbiollogia inexistente!" });
      }
    } catch (error) {
      MicrobiologyLog.handleUnsuccessfulDelete(email, error, Number(id));
      return res.json({ error });
    }
  }
}
export default new MicrobiologyController();
