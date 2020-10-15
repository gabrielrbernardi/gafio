/****************************************
| Data: 01/10/2020                      |
| Resumo: Controlador Avaliação (CRUD)  |
| Sistema: GAFio                        |
****************************************/

import { Request, Response } from "express";
import knex from "../database/connection";

class AvaliacaoController {
    //CRIAR AVALIACAO
    async create(request: Request, response: Response){
        const {
            IdProntuario,
            NroAvaliacao,
            DataAvaliacao,
            ResultadoCulturas,
            ResCulturasAcao,
            DoseCorreta,
            PosologiaCorreta,
            AlertaDot,
            AlertaDotDescricao,
            DisfuncaoRenal,
            Hemodialise,
            AtbOral,
            AtbContraindicacao,
            AlteracaoPrescricao,
            AtbDiluicaoInfusao,
            InteracaoAtbMedicamento,
            TrocaAtb,
            NovoAtb
        } = request.body

        if (!IdProntuario || !NroAvaliacao || !DataAvaliacao || !DisfuncaoRenal || !Hemodialise || !AtbOral || !AtbContraindicacao || !AtbDiluicaoInfusao || !InteracaoAtbMedicamento || !TrocaAtb){
            return response.json({
               CreatedAssessment: false,
               error: "Preencha todos os campos necessários."
            })
        }else{
            const medicalRecordsDB = await knex("Prontuario").where("SeqProntuario", IdProntuario)
            const medicalRecords = medicalRecordsDB[0]

            if(medicalRecords){
                const assessmentDB = await knex("Avaliacao").where("NroAvaliacao", NroAvaliacao)
                const assessment = assessmentDB[0]

                if(!assessment){      
                    var res = DataAvaliacao.split("-")
                    var dataTratada = res[2] + "/" + res[1] + "/" + res[0]

                    await knex("Avaliacao").insert({
                        IdProntuario,
                        IdPaciente: medicalRecords.SeqPaciente,
                        NroAvaliacao,
                        DataAvaliacao: dataTratada,
                        ResultadoCulturas,
                        ResCulturasAcao,
                        DoseCorreta,
                        PosologiaCorreta,
                        AlertaDot,
                        AlertaDotDescricao,
                        DisfuncaoRenal,
                        Hemodialise,
                        AtbOral,
                        AtbContraindicacao,
                        AlteracaoPrescricao,
                        AtbDiluicaoInfusao,
                        InteracaoAtbMedicamento,
                        TrocaAtb,
                        NovoAtb
                    }).then(() => {
                        return response.json({CreatedAssessment: true})
                    }).catch((error) => {
                        return response.json({CreatedAssessment: false, error})
                    })
                }else{
                    return response.json({
                        CreatedAssessment: false,
                        error: "O número da avaliação já existe."
                    })
                }
            }else{
                return response.json({
                    CreatedAssessment: false,
                    error: "A sequência de prontuário não existe."
                })
            }
        }
    }

    //LISTA DAS AVALIACOES
    async index(request: Request, response: Response) {
        const assessment = await knex("Avaliacao").select("*");
        return response.send(assessment);
    }

    //PAGINACAO DA LISTA DE AVALIACOES
    async indexPagination(request: Request, response: Response){
        const { SeqProntuario } = request.body;
        var page = String(request.query.page);
        var pageRequest = parseInt(page) / 10;
        const rows = 10;
        try{
            const assessments = await knex("Avaliacao").where('IdProntuario', 2).offset((pageRequest-1)*rows).limit(rows);
    
            var serializedAssessments = assessments.map(assessment => {
                return {
                    NroAvaliacao: assessment.NroAvaliacao,
                    DataAvaliacao: assessment.DataAvaliacao,
                    AtbOral: assessment.AtbOral,
                    AtbContraindicacao: assessment.AtbContraindicacao,
                    TrocaAtb: assessment.TrocaAtb
                }
            })
            
            return response.json({showAssessments: true, assessments: serializedAssessments, length: serializedAssessments.length});
        }catch(err){
            return response.json({showAssessments: false, error: err});
        }
    }

    //FILTROS DE BUSCA
    
    
    //UPDATE DE DADOS
    async update(request: Request, response: Response) {
        const {
            IdProntuario,
            NroAvaliacao,
            DataAvaliacao,
            ResultadoCulturas,
            ResCulturasAcao,
            DoseCorreta,
            PosologiaCorreta,
            AlertaDot,
            AlertaDotDescricao,
            DisfuncaoRenal,
            Hemodialise,
            AtbOral,
            AtbContraindicacao,
            AlteracaoPrescricao,
            AtbDiluicaoInfusao,
            InteracaoAtbMedicamento,
            TrocaAtb,
            NovoAtb
        } = request.body

        if (!IdProntuario || !NroAvaliacao || !DataAvaliacao || !DisfuncaoRenal || !Hemodialise || !AtbOral || !AtbContraindicacao || !AtbDiluicaoInfusao || !InteracaoAtbMedicamento || !TrocaAtb){
            return response.json({
            updatedAssessment: false,
            error: "Preencha todos os campos necessários."
            })
        }else{
            const medicalRecordsDB = await knex("Prontuario").where("SeqProntuario", IdProntuario)
            const medicalRecords = medicalRecordsDB[0]

            if(medicalRecords){
                    var res = DataAvaliacao.split("-")
                    var dataTratada = res[2] + "/" + res[1] + "/" + res[0]

                    await knex("Avaliacao").where('NroAvaliacao', NroAvaliacao).update({
                        IdProntuario: IdProntuario,
                        IdPaciente: medicalRecords.SeqPaciente,
                        DataAvaliacao: dataTratada,
                        ResultadoCulturas: ResultadoCulturas,
                        ResCulturasAcao: ResCulturasAcao,
                        DoseCorreta: DoseCorreta,
                        PosologiaCorreta: PosologiaCorreta,
                        AlertaDot: AlertaDot,
                        AlertaDotDescricao: AlertaDotDescricao,
                        DisfuncaoRenal: DisfuncaoRenal,
                        Hemodialise: Hemodialise,
                        AtbOral: AtbOral,
                        AtbContraindicacao: AtbContraindicacao,
                        AlteracaoPrescricao: AlteracaoPrescricao,
                        AtbDiluicaoInfusao: AtbDiluicaoInfusao,
                        InteracaoAtbMedicamento: InteracaoAtbMedicamento,
                        TrocaAtb: TrocaAtb,
                        NovoAtb: NovoAtb
                    }).then(() => {
                        return response.json({updatedAssessment: true})
                    }).catch((error) => {
                        return response.json({updatedAssessment: false, error})
                    })
            }else{
                return response.json({
                    updatedAssessment: false,
                    error: "A sequência de prontuário não existe."
                })
            }
        }
    }

    //DELETAR AVALIACAO
    async delete(request: Request, response: Response) {
        const { NroAvaliacao } = request.body

        const assessmentDB = await knex("Avaliacao").where("NroAvaliacao", NroAvaliacao);
        const assessment = assessmentDB[0];

        if(assessment){
            await knex("Avaliacao").where("NroAvaliacao", NroAvaliacao).delete().then(() => {
                return response.json({deletedAssessment: true})
            }).catch((error) => {
                return response.json({deletedAssessment: false, error})
            })
        }else{
            return response.json({
                deletedAssessment: false,
                error: "Avaliação não encontrada."
            })
        }
    }
}

export default AvaliacaoController