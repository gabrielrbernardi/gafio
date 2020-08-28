/****************************************
| Data: 20/07/2020                      |
| Resumo: Controlador Prontuário (CRUD) |
| Sistema: GAFio                        |
****************************************/

import { Request, Response } from "express";
import knex from "../database/connection";

class ProntuarioController {
   async create(request: Request, response: Response) {
      const {
         NroProntuario,
         NroPaciente,
         DataInternacao,
         CodDoencaPrincipal,
         CodDoencaSecundario,
         SistemaAcometido,
         CodComorbidade,
         Origem,
         Alocacao,
         Coleta,
         ResultadoColeta,
         CodAtbPrimario,
         CodAtbSecundario,
         SitioInfecaoPrimario,
         TratamentoCCIH,
         IndicacaoSepse,
         DisfuncaoRenal,
         OrigemInfeccao,
         DoseCorreta,
         PosologiaCorreta
      } = request.body
      
      if (!NroProntuario || !NroPaciente || !DataInternacao || !CodDoencaPrincipal || !SistemaAcometido || !Origem || !Alocacao || !CodAtbPrimario || !TratamentoCCIH || !IndicacaoSepse || !DisfuncaoRenal || !OrigemInfeccao) {
         return response.json({
           createdMedRec: false,
           error: "Preencha todos os campos."
         })
      }

      await knex("Prontuario").insert({
         NroProntuario,
         NroPaciente,
         DataInternacao,
         CodDoencaPrincipal,
         CodDoencaSecundario,
         SistemaAcometido,
         CodComorbidade,
         Origem,
         Alocacao,
         Coleta,
         ResultadoColeta,
         CodAtbPrimario,
         CodAtbSecundario,
         SitioInfecaoPrimario,
         TratamentoCCIH,
         IndicacaoSepse,
         DisfuncaoRenal,
         OrigemInfeccao,
         DoseCorreta,
         PosologiaCorreta
      }).then(respostaDB => {
        console.log(respostaDB);
        return response.json({CreatedMedicalRecords: true});
      })
   }

   async index(request: Request, response: Response) {
      const prontuario = await knex("Prontuario").select("*");
      return response.json(prontuario);
   }

   async indexByNroProntuario(request: Request, response: Response) {
      const NroProntuario = request.params;

      const filteredProntuario = await knex("Prontuario").where(
         "NroProntuario",
         NroProntuario
      );
      return response.json(filteredProntuario);
   }

   async indexByDataInternacao(request: Request, response: Response) {
      const data = request.params;

      const filteredProntuario = await knex("Prontuario").where(
         "DataInternacao",
         data
      );
      return response.json(filteredProntuario);
   }

   async indexByOrigem(request: Request, response: Response) {
      const origem = request.params;

      const filteredProntuario = await knex("Prontuario").where(
         "Origem",
         origem
      );
      return response.json(filteredProntuario);
   }

   async delete(request: Request, response: Response) {
      const { NroProntuario } = request.body;
      const prontuario = await knex("Prontuario").where(
         "NroProntuario",
         NroProntuario
      );

      if (prontuario) {
         await knex("Historico").where("NroProntuario", NroProntuario).delete();
         return response.json({ deletedprontuario: true });
      } else {
         return response.json({
            deletedprontuario: false,
            error: "Historico não encontrado",
         });
      }
   }
}

export default ProntuarioController;
