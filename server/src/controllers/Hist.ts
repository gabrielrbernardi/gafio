/****************************************
| Data: 20/07/2020                      |
| Resumo: Controlador Histórico (CRUD)  |
| Sistema: GAFio                        |
****************************************/

import { Request, Response } from "express";
import knex from "../database/connection";

class HistController {
   async create(request: Request, response: Response) {
      const {
         NroProntuario,
         NomePaciente,
         DataNascimento,
         Genero,
      } = request.body;

      await knex("Historico").insert({
         NroProntuario,
         NomePaciente,
         DataNascimento,
         Genero,
      });
      return response.json({
         NroProntuario,
         NomePaciente,
         DataNascimento,
         Genero,
      });
   }

   async index(request: Request, response: Response) {
      const hist = await knex("Historico").select("*");
      response.json(hist);
   }

   async indexByNroProntuario(request: Request, response: Response) {
      const NroProntuario = request.params;

      const filteredHist = await knex("Historico").where(
         "NroProntuario",
         NroProntuario
      );
      return response.json(filteredHist);
   }

   async indexByNomePaciente(request: Request, response: Response) {
      const NomePaciente = request.params;

      const filteredHist = await knex("Historico").where(
         "NomePaciente",
         NomePaciente
      );
      return response.json(filteredHist);
   }

   async delete(request: Request, response: Response) {
      const { IdHistorico } = request.params;
      const historico = await knex("Historico").where(
         "IdHistorico",
         IdHistorico
      );

      if (historico) {
         await knex("Historico").where("IdHistorico", IdHistorico).delete();
         return response.json({ deletedHistorico: true });
      } else {
         return response.json({
            deletedHistorico: false,
            error: "Historico não encontrado",
         });
      }
   }
}

export default HistController;
