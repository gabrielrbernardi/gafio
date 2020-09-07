/****************************************
| Data: 28/08/2020                      |
| Resumo: Controlador Prontuário (CRUD) |
| Sistema: GAFio                        |
****************************************/

import { Request, Response } from "express";
import knex from "../database/connection";

class ProntuarioController {
   //CRIAR PRONTUARIO
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
         SitioInfeccaoPrimario,
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
            error: "Preencha todos os campos necessários."
         })
      }else{
         const MedicalRecordDB = await knex("Prontuario").where("NroProntuario", NroProntuario);
         const MedicalRecord = MedicalRecordDB[0];
         
         if(!MedicalRecord){
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
               SitioInfeccaoPrimario,
               TratamentoCCIH,
               IndicacaoSepse,
               DisfuncaoRenal,
               OrigemInfeccao,
               DoseCorreta,
               PosologiaCorreta
            }).then((SeqProntuarioDB) => {
               knex("Historico").insert({"IdProntuario": SeqProntuarioDB, "IdPaciente": NroPaciente}).then(() => {
                  return response.json({CreatedMedicalRecords: true});
               }).catch((error) =>{
                  return response.json({CreatedMedicalRecords: false, error});
               })
            }).catch(error => {
               return response.json({CreatedMedicalRecords: false, error});
            })
         }else{
            return response.json({
               CreatedMedicalRecords: false,
               error: "O número de prontuário já existe."
            });
         }
      }
   }

   //PAGINACAO DA LISTA DE PRONTUARIOS
   async indexPagination(request: Request, response: Response){
      const {page} = request.params;
      var pageRequest = parseInt(page) / 10;
      const rows = 10;
      try{
          const MedicalRecords = await knex("Prontuario").select("*").offset((pageRequest-1)*rows).limit(rows);
      
          var serializedMedicalRecords = MedicalRecords.map(MedicalRecord => {
              return {
                  NroProntuario: MedicalRecord.NroProntuario,
                  NroPaciente: MedicalRecord.NroPaciente,
                  DataNascimento: null,
                  NomePaciente: null,
                  Genero: null,
                  DataInternacao: MedicalRecord.DataInternacao,
                  DiagnosticoPrincipal: MedicalRecord.CodDoencaPrincipal,
                  Alocacao: MedicalRecord.Alocacao,
                  Desfecho: MedicalRecord.Desfecho
              }
          })
          for(let i = 0; i < serializedMedicalRecords.length; i++){
              const patientDB = await knex("Paciente").where("NroPaciente", serializedMedicalRecords[i]["NroPaciente"]);
              serializedMedicalRecords[i]['NomePaciente'] = patientDB[0]['NomePaciente'];
              serializedMedicalRecords[i]['Genero'] = patientDB[0]['Genero'];
              serializedMedicalRecords[i]['DataNascimento'] = patientDB[0]['DataNascimento'];
              const diseaseDB = await knex("Doenca").where("CodDoenca", serializedMedicalRecords[i]["DiagnosticoPrincipal"]);
              serializedMedicalRecords[i]['DiagnosticoPrincipal'] = diseaseDB[0]['Nome'];
          }
          const MedicalRecordsLength = (await knex("Prontuario").select("*")).length;
          return response.json({showMedicalRecords: true, serializedMedicalRecords, length: MedicalRecordsLength});
      }catch(err){
          return response.json({showMedicalRecords: false, error: err});
      }
  }

   //LISTA DOS PRONTUARIOS
   async index(request: Request, response: Response) {
      const MedicalRecord = await knex("Prontuario").select("*");
      return response.send(MedicalRecord);
   }
   
   //FILTROS DE BUSCA
      //FILTRAR POR NroProntuario
      async indexByNroProntuario(request: Request, response: Response) {
         const {nroProntuario} = request.query;
         var page = String(request.query.page);
         var pageRequest = parseInt(page) / 10;
         const rows = 10;
         try{
            const MedicalRecordDB = await knex("Prontuario").where('NroProntuario', 'like', `%${nroProntuario}%`).offset((pageRequest-1)*rows).limit(rows);
            var serializedMedicalRecords = MedicalRecordDB.map(MedicalRecordDB => {
               return {
                  NroProntuario: MedicalRecordDB.NroProntuario,
                  NroPaciente: MedicalRecordDB.NroPaciente,
                  DataNascimento: null,
                  NomePaciente: null,
                  Genero: null,
                  DataInternacao: MedicalRecordDB.DataInternacao,
                  DiagnosticoPrincipal: MedicalRecordDB.CodDoencaPrincipal,
                  Alocacao: MedicalRecordDB.Alocacao,
                  Desfecho: MedicalRecordDB.Desfecho
               }
            })
            for(let i = 0; i < serializedMedicalRecords.length; i++){
               const patientDB = await knex("Paciente").where("NroPaciente", serializedMedicalRecords[i]["NroPaciente"]);
               serializedMedicalRecords[i]['NomePaciente'] = patientDB[0]['NomePaciente'];
               serializedMedicalRecords[i]['Genero'] = patientDB[0]['Genero'];
               serializedMedicalRecords[i]['DataNascimento'] = patientDB[0]['DataNascimento'];
               const diseaseDB = await knex("Doenca").where("CodDoenca", serializedMedicalRecords[i]["DiagnosticoPrincipal"]);
               serializedMedicalRecords[i]['DiagnosticoPrincipal'] = diseaseDB[0]['Nome'];
            }
            const MedicalRecordsLength = (await knex("Prontuario").select("*")).length;
            return response.json({showMedicalRecords: true, serializedMedicalRecords, length: MedicalRecordsLength, length1: serializedMedicalRecords.length});
         }catch(err){
            return response.json({showMedicalRecords: false, error: err});
         }
      }
   
      //FILTRAR POR NroPaciente
      async indexByNroPaciente(request: Request, response: Response) {
         const {nroPaciente} = request.query;
         var page = String(request.query.page);
         var pageRequest = parseInt(page) / 10;
         const rows = 10;
         try{
            const MedicalRecordDB = await knex("Prontuario").where('NroPaciente', 'like', `%${nroPaciente}%`).offset((pageRequest-1)*rows).limit(rows);
            var serializedMedicalRecords = MedicalRecordDB.map(MedicalRecordDB => {
               return {
                  NroProntuario: MedicalRecordDB.NroProntuario,
                  NroPaciente: MedicalRecordDB.NroPaciente,
                  DataNascimento: null,
                  NomePaciente: null,
                  Genero: null,
                  DataInternacao: MedicalRecordDB.DataInternacao,
                  DiagnosticoPrincipal: MedicalRecordDB.CodDoencaPrincipal,
                  Alocacao: MedicalRecordDB.Alocacao,
                  Desfecho: MedicalRecordDB.Desfecho
               }
            })
            for(let i = 0; i < serializedMedicalRecords.length; i++){
               const patientDB = await knex("Paciente").where("NroPaciente", serializedMedicalRecords[i]["NroPaciente"]);
               serializedMedicalRecords[i]['NomePaciente'] = patientDB[0]['NomePaciente'];
               serializedMedicalRecords[i]['Genero'] = patientDB[0]['Genero'];
               serializedMedicalRecords[i]['DataNascimento'] = patientDB[0]['DataNascimento'];
               const diseaseDB = await knex("Doenca").where("CodDoenca", serializedMedicalRecords[i]["DiagnosticoPrincipal"]);
               serializedMedicalRecords[i]['DiagnosticoPrincipal'] = diseaseDB[0]['Nome'];
            }
            const MedicalRecordsLength = (await knex("Prontuario").select("*")).length;
            return response.json({showMedicalRecords: true, serializedMedicalRecords, length: MedicalRecordsLength, length1: serializedMedicalRecords.length});
         }catch(err){
            return response.json({showMedicalRecords: false, error: err});
         }
      }

      //FILTRAR POR DataInternacao
      async indexByDataInternacao(request: Request, response: Response) {
         const {dataInternacao} = request.query;
         var page = String(request.query.page);
         var pageRequest = parseInt(page) / 10;
         const rows = 10;
         try{
            const MedicalRecordDB = await knex("Prontuario").where('DataInternacao', 'like', `%${dataInternacao}%`).offset((pageRequest-1)*rows).limit(rows);
            var serializedMedicalRecords = MedicalRecordDB.map(MedicalRecordDB => {
               return {
                  NroProntuario: MedicalRecordDB.NroProntuario,
                  NroPaciente: MedicalRecordDB.NroPaciente,
                  DataNascimento: null,
                  NomePaciente: null,
                  Genero: null,
                  DataInternacao: MedicalRecordDB.DataInternacao,
                  DiagnosticoPrincipal: MedicalRecordDB.CodDoencaPrincipal,
                  Alocacao: MedicalRecordDB.Alocacao,
                  Desfecho: MedicalRecordDB.Desfecho
               }
            })
            for(let i = 0; i < serializedMedicalRecords.length; i++){
               const patientDB = await knex("Paciente").where("NroPaciente", serializedMedicalRecords[i]["NroPaciente"]);
               serializedMedicalRecords[i]['NomePaciente'] = patientDB[0]['NomePaciente'];
               serializedMedicalRecords[i]['Genero'] = patientDB[0]['Genero'];
               serializedMedicalRecords[i]['DataNascimento'] = patientDB[0]['DataNascimento'];
               const diseaseDB = await knex("Doenca").where("CodDoenca", serializedMedicalRecords[i]["DiagnosticoPrincipal"]);
               serializedMedicalRecords[i]['DiagnosticoPrincipal'] = diseaseDB[0]['Nome'];
            }
            const MedicalRecordsLength = (await knex("Prontuario").select("*")).length;
            return response.json({showMedicalRecords: true, serializedMedicalRecords, length: MedicalRecordsLength, length1: serializedMedicalRecords.length});
         }catch(err){
            return response.json({showMedicalRecords: false, error: err});
         }
      }

   //UPDATE DE DADOS
   async update(request: Request, response: Response) {
      
      const { id } = request.params
      
      if(id){
         const {
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
            SitioInfeccaoPrimario,
            TratamentoCCIH,
            IndicacaoSepse,
            DisfuncaoRenal,
            OrigemInfeccao,
            DoseCorreta,
            PosologiaCorreta
         } = request.body
   
         if (!NroPaciente || !DataInternacao || !CodDoencaPrincipal || !SistemaAcometido || !Origem || !Alocacao || !CodAtbPrimario || !TratamentoCCIH || !IndicacaoSepse || !DisfuncaoRenal || !OrigemInfeccao) {
            return response.json({
               updatedMedicalRecord: false,
               error: "Preencha todos os campos necessários."
            })
         }else{
            const MedicalRecordDB = await knex('Prontuario').where('NroProntuario', id)
            const MedicalRecord = MedicalRecordDB[0]
            
            if(MedicalRecord){
               await knex('Prontuario').where('NroProntuario', id).update({
                  NroPaciente: NroPaciente,
                  DataInternacao: DataInternacao,
                  CodDoencaPrincipal: CodDoencaPrincipal,
                  CodDoencaSecundario: CodDoencaSecundario,
                  SistemaAcometido: SistemaAcometido,
                  CodComorbidade: CodComorbidade,
                  Origem: Origem,
                  Alocacao: Alocacao,
                  Coleta: Coleta,
                  ResultadoColeta: ResultadoColeta,
                  CodAtbPrimario: CodAtbPrimario,
                  CodAtbSecundario: CodAtbSecundario,
                  SitioInfeccaoPrimario: SitioInfeccaoPrimario,
                  TratamentoCCIH: TratamentoCCIH,
                  IndicacaoSepse: IndicacaoSepse,
                  DisfuncaoRenal: DisfuncaoRenal,
                  OrigemInfeccao: OrigemInfeccao,
                  DoseCorreta: DoseCorreta,
                  PosologiaCorreta : PosologiaCorreta
               }).then(() => {
                  knex('Historico').where('NroProntuario', id).update({
                     NroPaciente: NroPaciente
                  }).then(() => {
                     return response.json({updatedMedicalRecord: true})
                  }).catch(error => {
                     return response.json({updatedMedicalRecord: false, error})
                  })
               }).catch(error => {
                  return response.json({updatedMedicalRecord: false, error});
               })
            }else{
               return response.json({updatedMedicalRecord: false, error: "O número de prontuário não existe."});
            }
         }
      }else{
         return response.json({updatedMedicalRecord: false, error: "É necessário informar o número do prontuário."});
      }
   }

   //DELETAR PRONTUARIO
   async delete(request: Request, response: Response) {
      const { id } = request.params;
      const MedicalRecordDB = await knex("Prontuario").where(
         "NroProntuario",
         id
      );
      
      const MedicalRecord = MedicalRecordDB[0];

      if (MedicalRecord) {
         await knex("Historico").where("IdProntuario", MedicalRecord.SeqProntuario).delete().then(() => {
            const AvaliacaoDB = knex("Avaliacao").where("SeqProntuario", MedicalRecord.SeqProntuario)
            if(AvaliacaoDB){
               knex("Avaliacao").where("SeqProntuario", MedicalRecord.SeqProntuario).delete().then(() => {
                  knex("Prontuario").where("NroProntuario", id).delete().then(() => {
                     return response.json({ deletedMedicalRecord: true });
                  }).catch((error) => {
                     return response.json({ deletedMedicalRecord: false, error });
                  })
               }).catch((error) => {
                  return response.json({ deletedMedicalRecord: false, error });
               })
            }else{
               knex("Prontuario").where("NroProntuario", id).delete().then(() => {
                  return response.json({ deletedMedicalRecord: true });
               }).catch((error) => {
                  return response.json({ deletedMedicalRecord: false, error });
               })
            }
         }).catch((error) => {
            return response.json({ deletedMedicalRecord: false, error });
         })
      } else {
         return response.json({
            deletedMedicalRecord: false,
            error: "Prontuário não encontrado."
         });
      }
   }
}

export default ProntuarioController;