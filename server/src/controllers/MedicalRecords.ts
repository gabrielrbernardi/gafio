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
            const patientDB = await knex("Paciente").where("NroPaciente", NroPaciente)
            const patient = patientDB[0]
            
            if(patient){
               var res = DataInternacao.split("-")
               var datatratada = res[2] + "/" + res[1] + "/" + res[0]

               await knex("Prontuario").insert({
                  NroProntuario,
                  NroPaciente,
                  DataInternacao: datatratada,
                  CodDoencaPrincipal,
                  CodDoencaSecundario,
                  SistemaAcometido,
                  CodComorbidade,
                  Origem,
                  Alocacao,
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
                     return response.json({CreatedMedicalRecord: true});
                  }).catch((error) =>{
                     return response.json({CreatedMedicalRecord: false, error});
                  })
               }).catch(error => {
                  return response.json({CreatedMedicalRecord: false, error});
               })
            }else{
               return response.json({
                  CreatedMedicalRecord: false,
                  error: "O número de paciente não existe."
               });
            }
         }else{
            return response.json({
               CreatedMedicalRecord: false,
               error: "O número de prontuário já existe."
            });
         }
      }
   }

   //PAGINACAO DA LISTA DE PRONTUARIOS
   async indexPagination(request: Request, response: Response){
      var page = String(request.query.page);
      if(!page){
         page = "10"
      }
      var pageRequest = parseInt(page) / 10;
      const rows = 10;
      try{
         const MedicalRecords = await knex("Prontuario").select("*").orderBy('SeqProntuario', 'desc').offset((pageRequest-1)*rows).limit(rows)

         var serializedMedicalRecords = MedicalRecords.map(MedicalRecord => {
            var newDesfecho
            if(MedicalRecord.Desfecho == null){
               newDesfecho = "Sem desfecho"
            }else{
               if(MedicalRecord.Desfecho == "A"){
                  newDesfecho = "Alta"
               }
               if(MedicalRecord.Desfecho == "O"){
                  newDesfecho = "Óbito"
               }
               if(MedicalRecord.Desfecho == "T"){
                  newDesfecho = "Transferência"
               }
            }
            return {
               NroProntuario: MedicalRecord.NroProntuario,
               NroPaciente: MedicalRecord.NroPaciente,
               DataNascimento: null,
               NomePaciente: null,
               Genero: null,
               DataInternacao: MedicalRecord.DataInternacao,
               DiagnosticoPrincipal: MedicalRecord.CodDoencaPrincipal,
               CodDoencaPrincipal: MedicalRecord.CodDoencaPrincipal,
               Alocacao: MedicalRecord.Alocacao,
               Desfecho: newDesfecho,
               CodDoencaSecundario: MedicalRecord.CodDoencaSecundario,
               SistemaAcometido: MedicalRecord.SistemaAcometido,
               CodComorbidade: MedicalRecord.CodComorbidade,
               Origem: MedicalRecord.Origem,
               ResultadoColeta: MedicalRecord.ResultadoColeta,
               CodAtbPrimario: MedicalRecord.CodAtbPrimario,
               CodAtbSecundario: MedicalRecord.CodAtbSecundario,
               SitioInfeccaoPrimario: MedicalRecord.SitioInfeccaoPrimario,
               TratamentoCCIH: MedicalRecord.TratamentoCCIH,
               IndicacaoSepse: MedicalRecord.IndicacaoSepse,
               DisfuncaoRenal: MedicalRecord.DisfuncaoRenal,
               OrigemInfeccao: MedicalRecord.OrigemInfeccao,
               DoseCorreta: MedicalRecord.DoseCorreta,
               PosologiaCorreta: MedicalRecord.PosologiaCorreta
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
         return response.json({showMedicalRecords: true, medicalRecords: serializedMedicalRecords, length: MedicalRecordsLength});
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
         if(!page){
            page = "10"
         }
         var pageRequest = parseInt(page) / 10;
         const rows = 10;
         try{
            const MedicalRecord = await knex("Prontuario").where('NroProntuario', 'like', `%${nroProntuario}%`).offset((pageRequest-1)*rows).limit(rows);
            var serializedMedicalRecords = MedicalRecord.map(MedicalRecord => {
               var newDesfecho
               if(MedicalRecord.Desfecho == null){
                  newDesfecho = "Sem desfecho"
               }else{
                  if(MedicalRecord.Desfecho == "A"){
                     newDesfecho = "Alta"
                  }
                  if(MedicalRecord.Desfecho == "O"){
                     newDesfecho = "Óbito"
                  }
                  if(MedicalRecord.Desfecho == "T"){
                     newDesfecho = "Transferência"
                  }
               }
               return {
                  NroProntuario: MedicalRecord.NroProntuario,
                  NroPaciente: MedicalRecord.NroPaciente,
                  DataNascimento: null,
                  NomePaciente: null,
                  Genero: null,
                  DataInternacao: MedicalRecord.DataInternacao,
                  DiagnosticoPrincipal: MedicalRecord.CodDoencaPrincipal,
                  CodDoencaPrincipal: MedicalRecord.CodDoencaPrincipal,
                  Alocacao: MedicalRecord.Alocacao,
                  Desfecho: newDesfecho,
                  CodDoencaSecundario: MedicalRecord.CodDoencaSecundario,
                  SistemaAcometido: MedicalRecord.SistemaAcometido,
                  CodComorbidade: MedicalRecord.CodComorbidade,
                  Origem: MedicalRecord.Origem,
                  ResultadoColeta: MedicalRecord.ResultadoColeta,
                  CodAtbPrimario: MedicalRecord.CodAtbPrimario,
                  CodAtbSecundario: MedicalRecord.CodAtbSecundario,
                  SitioInfeccaoPrimario: MedicalRecord.SitioInfeccaoPrimario,
                  TratamentoCCIH: MedicalRecord.TratamentoCCIH,
                  IndicacaoSepse: MedicalRecord.IndicacaoSepse,
                  DisfuncaoRenal: MedicalRecord.DisfuncaoRenal,
                  OrigemInfeccao: MedicalRecord.OrigemInfeccao,
                  DoseCorreta: MedicalRecord.DoseCorreta,
                  PosologiaCorreta: MedicalRecord.PosologiaCorreta
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
            const MedicalRecordsLength = (await knex("Prontuario").count('NroProntuario').where('NroProntuario', 'like', `%${nroProntuario}%`));
            return response.json({showMedicalRecords: true, medicalRecords: serializedMedicalRecords, length: MedicalRecordsLength, length1: serializedMedicalRecords.length});
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
            const MedicalRecord = await knex("Prontuario").where('NroPaciente', 'like', `%${nroPaciente}%`).offset((pageRequest-1)*rows).limit(rows);
            var serializedMedicalRecords = MedicalRecord.map(MedicalRecord => {
               var newDesfecho
               if(MedicalRecord.Desfecho == null){
                  newDesfecho = "Sem desfecho"
               }else{
                  if(MedicalRecord.Desfecho == "A"){
                     newDesfecho = "Alta"
                  }
                  if(MedicalRecord.Desfecho == "O"){
                     newDesfecho = "Óbito"
                  }
                  if(MedicalRecord.Desfecho == "T"){
                     newDesfecho = "Transferência"
                  }
               }
               return {
                  NroProntuario: MedicalRecord.NroProntuario,
                  NroPaciente: MedicalRecord.NroPaciente,
                  DataNascimento: null,
                  NomePaciente: null,
                  Genero: null,
                  DataInternacao: MedicalRecord.DataInternacao,
                  DiagnosticoPrincipal: MedicalRecord.CodDoencaPrincipal,
                  CodDoencaPrincipal: MedicalRecord.CodDoencaPrincipal,
                  Alocacao: MedicalRecord.Alocacao,
                  Desfecho: newDesfecho,
                  CodDoencaSecundario: MedicalRecord.CodDoencaSecundario,
                  SistemaAcometido: MedicalRecord.SistemaAcometido,
                  CodComorbidade: MedicalRecord.CodComorbidade,
                  Origem: MedicalRecord.Origem,
                  ResultadoColeta: MedicalRecord.ResultadoColeta,
                  CodAtbPrimario: MedicalRecord.CodAtbPrimario,
                  CodAtbSecundario: MedicalRecord.CodAtbSecundario,
                  SitioInfeccaoPrimario: MedicalRecord.SitioInfeccaoPrimario,
                  TratamentoCCIH: MedicalRecord.TratamentoCCIH,
                  IndicacaoSepse: MedicalRecord.IndicacaoSepse,
                  DisfuncaoRenal: MedicalRecord.DisfuncaoRenal,
                  OrigemInfeccao: MedicalRecord.OrigemInfeccao,
                  DoseCorreta: MedicalRecord.DoseCorreta,
                  PosologiaCorreta: MedicalRecord.PosologiaCorreta
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
            const MedicalRecordsLength = (await knex("Prontuario").count('NroPaciente').where('NroPaciente', 'like', `%${nroPaciente}%`));
            return response.json({showMedicalRecords: true, medicalRecords: serializedMedicalRecords, length: MedicalRecordsLength, length1: serializedMedicalRecords.length});
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
            const MedicalRecord = await knex("Prontuario").where('DataInternacao', 'like', `%${dataInternacao}%`).offset((pageRequest-1)*rows).limit(rows);
            var serializedMedicalRecords = MedicalRecord.map(MedicalRecord => {
               var newDesfecho
               if(MedicalRecord.Desfecho == null){
                  newDesfecho = "Sem desfecho"
               }else{
                  if(MedicalRecord.Desfecho == "A"){
                     newDesfecho = "Alta"
                  }
                  if(MedicalRecord.Desfecho == "O"){
                     newDesfecho = "Óbito"
                  }
                  if(MedicalRecord.Desfecho == "T"){
                     newDesfecho = "Transferência"
                  }
               }
               return {
                  NroProntuario: MedicalRecord.NroProntuario,
                  NroPaciente: MedicalRecord.NroPaciente,
                  DataNascimento: null,
                  NomePaciente: null,
                  Genero: null,
                  DataInternacao: MedicalRecord.DataInternacao,
                  DiagnosticoPrincipal: MedicalRecord.CodDoencaPrincipal,
                  CodDoencaPrincipal: MedicalRecord.CodDoencaPrincipal,
                  Alocacao: MedicalRecord.Alocacao,
                  Desfecho: newDesfecho,
                  CodDoencaSecundario: MedicalRecord.CodDoencaSecundario,
                  SistemaAcometido: MedicalRecord.SistemaAcometido,
                  CodComorbidade: MedicalRecord.CodComorbidade,
                  Origem: MedicalRecord.Origem,
                  ResultadoColeta: MedicalRecord.ResultadoColeta,
                  CodAtbPrimario: MedicalRecord.CodAtbPrimario,
                  CodAtbSecundario: MedicalRecord.CodAtbSecundario,
                  SitioInfeccaoPrimario: MedicalRecord.SitioInfeccaoPrimario,
                  TratamentoCCIH: MedicalRecord.TratamentoCCIH,
                  IndicacaoSepse: MedicalRecord.IndicacaoSepse,
                  DisfuncaoRenal: MedicalRecord.DisfuncaoRenal,
                  OrigemInfeccao: MedicalRecord.OrigemInfeccao,
                  DoseCorreta: MedicalRecord.DoseCorreta,
                  PosologiaCorreta: MedicalRecord.PosologiaCorreta
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
            const MedicalRecordsLength = (await knex("Prontuario").count('DataInternacao').where('DataInternacao', 'like', `%${dataInternacao}%`));
            return response.json({showMedicalRecords: true, medicalRecords: serializedMedicalRecords, length: MedicalRecordsLength, length1: serializedMedicalRecords.length});
         }catch(err){
            return response.json({showMedicalRecords: false, error: err});
         }
      }

   //UPDATE DE DADOS
   async update(request: Request, response: Response) {
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
         const MedicalRecordDB = await knex('Prontuario').where('NroProntuario', NroProntuario)
         const MedicalRecord = MedicalRecordDB[0]
         
         if(MedicalRecord){
            const patientDB = await knex("Paciente").where("NroPaciente", NroPaciente)
            const patient = patientDB[0]
         
            if(patient){
               var res = DataInternacao.split("-")
               var datatratada = res[2] + "/" + res[1] + "/" + res[0]

               await knex('Prontuario').where('NroProntuario', NroProntuario).update({
                  NroPaciente: NroPaciente,
                  DataInternacao: datatratada,
                  CodDoencaPrincipal: CodDoencaPrincipal,
                  CodDoencaSecundario: CodDoencaSecundario,
                  SistemaAcometido: SistemaAcometido,
                  CodComorbidade: CodComorbidade,
                  Origem: Origem,
                  Alocacao: Alocacao,
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
                  knex('Historico').where('IdProntuario', MedicalRecord.SeqProntuario).update({
                     IdPaciente: patient.SeqPaciente
                  }).then(() => {
                     return response.json({updatedMedicalRecord: true})
                  }).catch(error => {
                     return response.json({updatedMedicalRecord: false, error})
                  })
               }).catch(error => {
                  return response.json({updatedMedicalRecord: false, error});
               })
            }else{
               return response.json({
                  updatedMedicalRecord: false,
                  error: "O número de paciente não existe."
               });
            }
         }else{
            return response.json({updatedMedicalRecord: false, error: "O número de prontuário não existe."});
         }
      }
   }

   //UPDATE NO DESFECHO
   async updateDesfecho(request: Request, response: Response){
      const { id } = request.params
      
      if(id){
         const {
            DataDesfecho,
            Desfecho
         } = request.body
         
         if (!DataDesfecho || !Desfecho) {
            return response.json({
               updatedMedicalRecord: false,
               error: "Preencha todos os campos necessários."
            })
         }else{
            const MedicalRecordDB = await knex('Prontuario').where('NroProntuario', id)
            const MedicalRecord = MedicalRecordDB[0]
            
            if(MedicalRecord){
               var res = DataDesfecho.split("-")
               var datatratada = res[2] + "/" + res[1] + "/" + res[0]
               
               await knex('Prontuario').where('NroProntuario', id).update({
                  DataDesfecho: datatratada,
                  Desfecho: Desfecho
               }).then(() => {
                  return response.json({updatedMedicalRecord: true})
               }).catch(error => {
                  return response.json({updatedMedicalRecord: false, error})
               })
            }else{
               return response.json({updatedMedicalRecord: false, error: "O número do prontuário está incorreto."});
            }
         }
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