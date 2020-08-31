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
               SitioInfecaoPrimario,
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
            const MedicalRecords = await knex("Prontuario").select("*")
            .offset((pageRequest-1)*rows).limit(rows);
            
            var serializedMedicalRecords:any[] = []
            MedicalRecords.map(async MedicalRecord => {
                await knex("Paciente").where("NroPaciente", MedicalRecord.NroPaciente).then(async patientDB => {
                    const diseaseDB = await knex("Doenca").where("CodDoenca", MedicalRecord.CodDoencaPrincipal).then(async diseaseDB => {
                        const patient = patientDB[0]
                        const disease = diseaseDB[0]
            
                        const serializedObject = {
                        NroProntuario: MedicalRecord.NroProntuario,
                        NroPaciente: MedicalRecord.NroPaciente,
                        Nome: patient.NomePaciente,
                        Genero: patient.Genero,
                        DataNascimento: patient.DataNascimento,
                        DataInternacao: MedicalRecord.DataInternacao,
                        DiagnosticoPrincipal: disease.Nome,
                        Alocacao: MedicalRecord.Alocacao,
                        Desfecho: MedicalRecord.Desfecho
                        }
                        serializedMedicalRecords.push(serializedObject);
                    }).catch(error => {
                        return response.json({showMedicalRecords: false, error, errorMessage: "Não foi possível buscar os dados da doença."});
                    })
                    const MedicalRecordsLength = (await knex("Prontuario").select("*")).length;
                    return response.json({showMedicalRecords: true, serializedMedicalRecords: serializedMedicalRecords, length: MedicalRecordsLength});
                }).catch(error => {
                    return response.json({showMedicalRecords: false, error, errorMessage: "Não foi possível buscar os dados do paciente."});
                })
            })
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
         const { NroProntuario } = request.params;

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
                  error: "Prontuário não encontrado. Verifique o número do prontuário e tente novamente.",
               });
            }
         }else{
            return response.json({MedicalRecordFound: false, error: "Digite o número do prontuário para procurar."})
         }
      }
   
      //FILTRAR POR NroPaciente
      async indexByNroPaciente(request: Request, response: Response) {
         const { NroPaciente } = request.params;

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
                  error: "Prontuário não encontrado. Verifique o número do paciente e tente novamente.",
               });
            }
         }else{
            return response.json({MedicalRecordFound: false, error: "Digite o número do paciente para procurar."})
         }
      }

      //FILTRAR POR DataInternacao
      async indexByDataInternacao(request: Request, response: Response) {
         const { DataInternacao } = request.params;

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
                  error: "Prontuário não encontrado. Verifique a data de internação e tente novamente.",
               });
            }
         }else{
            return response.json({MedicalRecordFound: false, error: "Digite a data de internação para procurar."})
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
               }).then(() => {
                  return response.json({updatedMedicalRecord: true});
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
