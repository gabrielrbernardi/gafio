/****************************************
| Data: 28/08/2020                      |
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
            CreatedMedicalRecords: false,
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
      }).then(() => {
        return response.json({CreatedMedicalRecords: true});
      }).catch(err => {
         return response.json({CreatedMedicalRecords: false, err});
      })
   }

   //FILTRO DA LISTA DE PRONTUARIOS

   async indexPagination(request: Request, response: Response){
      const {page} = request.params;
      var pageRequest = parseInt(page) / 10;
      const rows = 10;
      try{
        const MedicalRecords = await knex("Prontuario").select("*") //filtrar o select
        .offset((pageRequest-1)*rows).limit(rows);
        
         const serializedMedicalRecords = MedicalRecords.map(MedicalRecord =>{
            return {
               SeqProntuario: MedicalRecord.SeqProntuario,
               NroProntuario: MedicalRecord.NroProntuario,
               NroPaciente: MedicalRecord.NroPaciente,
               DataInternacao: MedicalRecord.DataInternacao
            }
         })

        const MedicalRecordsLength = (await knex("Prontuario").select("*")).length;
        return response.json({showMedicalRecords: true, serializedMedicalRecords, length: MedicalRecordsLength});
      }catch(err){
        return response.json({showMedicalRecords: false, error: err});
      }
   }

   //LISTAR PRONTUARIOS

   async index(request: Request, response: Response) {
      const MedicalRecord = await knex("Prontuario").select("*");
      return response.send(MedicalRecord);
    }
  

   //FILTRO POR ID DE PRONTUARIO, NRO PRONTUARIO, NRO PACIENTE, DATA DE INTERNACAO ((DEVO MODIFICAR REQUESICOES POR PARAMETRO))
   
      //FILTRAR POR NroProntuario
      async indexByNroProntuario(request: Request, response: Response) {
         const { NroProntuario } = request.body;

         if(NroProntuario){
            const MedicalRecordDB = await knex("Prontuario").where('NroProntuario', 'like', `%${NroProntuario}%`);
            const MedicalRecord = MedicalRecordDB[0];

            if (MedicalRecord) {
               return response.json({
                  MedicalRecordFound: true,
                  MedicalRecords: MedicalRecordDB
               });
            }else{
               return response.json({
                  MedicalRecordFound: false,
                  error: "Prontuario não encontrado. Verifique o numero do prontuario e tente novamente.",
               });
            }
         }else{
            return response.json({MedicalRecordFound: false, error: "Digite o numero do prontuario para procurar"})
         }
      }
   
      //FILTRAR POR NroPaciente
      async indexByNroPaciente(request: Request, response: Response) {
         const { NroPaciente } = request.body;

         if(NroPaciente){
            const MedicalRecordDB = await knex("Prontuario").where('NroPaciente', 'like', `%${NroPaciente}%`);
            const MedicalRecord = MedicalRecordDB[0];

            if (MedicalRecord) {
               return response.json({
                  MedicalRecordFound: true,
                  MedicalRecords: MedicalRecordDB
               });
            }else{
               return response.json({
                  MedicalRecordFound: false,
                  error: "Prontuario não encontrado. Verifique o numero do paciente e tente novamente.",
               });
            }
         }else{
            return response.json({MedicalRecordFound: false, error: "Digite o numero do paciente para procurar"})
         }
      }

      //FILTRAR POR DataInternacao
      async indexByDataInternacao(request: Request, response: Response) {
         const { DataInternacao } = request.body;

         if(DataInternacao){
            const MedicalRecordDB = await knex("Prontuario").where('DataInternacao', 'like', `%${DataInternacao}%`);
            const MedicalRecord = MedicalRecordDB[0];

            if (MedicalRecord) {
               return response.json({
                  MedicalRecordFound: true,
                  MedicalRecords: MedicalRecordDB
               });
            }else{
               return response.json({
                  MedicalRecordFound: false,
                  error: "Prontuario não encontrado. Verifique a data de internacao e tente novamente.",
               });
            }
         }else{
            return response.json({MedicalRecordFound: false, error: "Digite a data de internacao para procurar"})
         }
      }

   //UPDATE DE DADOS

   async update(request: Request, response: Response) {
      
      //NUMERO DE PRONTUARIO DEVE SER PASSADO POR PARAMETRO
      
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
         DataDesfecho,
         Coleta,
         ResultadoColeta,
         CodAtbPrimario,
         CodAtbSecundario,
         SitioInfecaoPrimario,
         TratamentoCCIH,
         IndicacaoSepse,
         DisfuncaoRenal,
         OrigemInfeccao,
         Desfecho,
         DoseCorreta,
         PosologiaCorreta
      } = request.body

      const MedicalRecordDB = await knex('Prontuario').where('NroProntuario', NroProntuario).update({
         DataInternacao: DataInternacao,
         CodDoencaPrincipal: CodDoencaPrincipal,
         CodDoencaSecundario: CodDoencaSecundario,
         SistemaAcometido: SistemaAcometido,
         CodComorbidade: CodComorbidade,
         Origem: Origem,
         Alocacao: Alocacao,
         DataDesfecho: DataDesfecho,
         Coleta: Coleta,
         ResultadoColeta: ResultadoColeta,
         CodAtbPrimario: CodAtbPrimario,
         CodAtbSecundario: CodAtbSecundario,
         SitioInfecaoPrimario: SitioInfecaoPrimario,
         TratamentoCCIH: TratamentoCCIH,
         IndicacaoSepse: IndicacaoSepse,
         DisfuncaoRenal: DisfuncaoRenal,
         OrigemInfeccao: OrigemInfeccao,
         Desfecho: Desfecho,
         DoseCorreta: DoseCorreta,
         PosologiaCorreta : PosologiaCorreta
      });
      if (MedicalRecordDB) {
         return response.json({ updatedMedicalRecord: true, MedicalRecordDB });
      } else {
         return response.json({
            updatedMedicalRecord: false,
            error: "Não foi possível alterar as informações.",
         });
      }
   }

   //DELETAR PRONTUARIO

   async delete(request: Request, response: Response) {
      const { NroProntuario } = request.body;
      const MedicalRecordDB = await knex("Prontuario").where(
         "NroProntuario",
         NroProntuario
      );
      
      const MedicalRecord = MedicalRecordDB[0];

      if (MedicalRecord) {
         await knex("Prontuario").where("NroProntuario", NroProntuario).delete();
         return response.json({ deletedMedicalRecord: true });
      } else {
         return response.json({
            deletedMedicalRecord: false,
            error: "Prontuario nao encontrado"
         });
      }
   }
}

export default ProntuarioController;
