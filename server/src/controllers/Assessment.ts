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

        if(!IdProntuario){
            return response.json({
                CreatedAssessment: false,
                error: "Prontuário não encontrado."
            })
        }else{
            if (!NroAvaliacao || !DataAvaliacao || !DisfuncaoRenal || !Hemodialise || !AtbOral || !AtbContraindicacao || !AtbDiluicaoInfusao || !InteracaoAtbMedicamento || !TrocaAtb){
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
                        var DataAvaliacaoTratada = DataAvaliacao.substring(0, 10);
                        var res = DataAvaliacaoTratada.split("-")
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
    }

    //LISTA DAS AVALIACOES
    async index(request: Request, response: Response) {
        const assessment = await knex("Avaliacao").select("*");
        return response.send(assessment);
    }

    //PAGINACAO DA LISTA DE AVALIACOES
    async indexPagination(request: Request, response: Response){
        var { seqProntuario } = request.query;
        if(!seqProntuario){
            return response.json({showAssessments: false, error: "Prontuário não encontrado."})
        }
        var page = String(request.query.page);
        if(!page){
            page = "10"
        }
        var pageRequest = parseInt(page) / 10;
        const rows = 10;
        
        const medicalRecordsDB = await knex("Prontuario").where("SeqProntuario", `${seqProntuario}`)
        const medicalRecords = medicalRecordsDB[0]

        if(medicalRecords){
            try{
                const assessments = await knex("Avaliacao").where('IdProntuario', `${seqProntuario}`).offset((pageRequest-1)*rows).limit(rows);
        
                var serializedAssessments = assessments.map(assessment => {
                    function trataDados(e: string) {
                        if(eval("assessment." + e) == "S"){
                            return "Sim"
                        }
                        if(eval("assessment." + e) == "NA"){
                            return "Não aplica"
                        }
                        if(eval("assessment." + e) == "N"){
                            return "Não"
                        }
                    }
                    var newAtbOral = trataDados("AtbOral")
                    var newTrocaAtb = trataDados("TrocaAtb")
                    var newAtbContraindicacao = trataDados("AtbContraindicacao")

                    return {
                        NroAvaliacao: assessment.NroAvaliacao,
                        DataAvaliacao: assessment.DataAvaliacao,
                        AtbOral: newAtbOral,
                        AtbContraindicacao: newAtbContraindicacao,
                        TrocaAtb: newTrocaAtb,
                        IdPaciente: medicalRecords.SeqPaciente,
                        ResultadoCulturas: assessment.ResultadoCulturas,
                        ResCulturasAcao: assessment.ResCulturasAcao,
                        DoseCorreta: assessment.DoseCorreta,
                        PosologiaCorreta: assessment.PosologiaCorreta,
                        AlertaDot: assessment.AlertaDot,
                        AlertaDotDescricao: assessment.AlertaDotDescricao,
                        DisfuncaoRenal: assessment.DisfuncaoRenal,
                        Hemodialise: assessment.Hemodialise,
                        AlteracaoPrescricao: assessment.AlteracaoPrescricao,
                        AtbDiluicaoInfusao: assessment.AtbDiluicaoInfusao,
                        InteracaoAtbMedicamento: assessment.InteracaoAtbMedicamento,
                        NovoAtb: assessment.NovoAtb,
                        NomePaciente: null
                    }
                })
                for(let i = 0; i < serializedAssessments.length; i++){
                    const patientDB = await knex("Paciente").where("SeqPaciente", serializedAssessments[i]["IdPaciente"]);
                    serializedAssessments[i]['NomePaciente'] = patientDB[0]['NomePaciente'];
                }
                return response.json({showAssessments: true, assessments: serializedAssessments, length: serializedAssessments.length});
            }catch(err){
                return response.json({showAssessments: false, error: err});
            }
        }else{
            return response.json({showAssessments: false, error: "Prontuário não encontrado."});
        }
    }

    //FILTROS DE BUSCA
        //FILTRAR POR NroAvaliacao
        async indexByNroAvaliacao(request: Request, response: Response) {
            var { seqProntuario, nroAvaliacao } = request.query;
            if(!seqProntuario){
                return response.json({showAssessments: false, error: "Prontuário não encontrado."})
            }
            var page = String(request.query.page);
            if(!page){
                page = "10"
            }
            var pageRequest = parseInt(page) / 10;
            const rows = 10;

            const medicalRecordsDB = await knex("Prontuario").where("SeqProntuario", `${seqProntuario}`)
            const medicalRecords = medicalRecordsDB[0]

            if(medicalRecords){
                try{
                    const assessments = await knex("Avaliacao").where("IdProntuario", `${seqProntuario}`).andWhere("NroAvaliacao", "like", `%${nroAvaliacao}%`)
                    .offset((pageRequest-1)*rows).limit(rows);
                    
                    var serializedAssessments = assessments.map(assessment => {
                        function trataDados(e: string) {
                            if(eval("assessment." + e) == "S"){
                                return "Sim"
                            }
                            if(eval("assessment." + e) == "NA"){
                                return "Não aplica"
                            }
                            if(eval("assessment." + e) == "N"){
                                return "Não"
                            }
                        }
                        var newAtbOral = trataDados("AtbOral")
                        var newTrocaAtb = trataDados("TrocaAtb")
                        var newAtbContraindicacao = trataDados("AtbContraindicacao")

                        return {
                            NroAvaliacao: assessment.NroAvaliacao,
                            DataAvaliacao: assessment.DataAvaliacao,
                            AtbOral: newAtbOral,
                            AtbContraindicacao: newAtbContraindicacao,
                            TrocaAtb: newTrocaAtb,
                            IdPaciente: medicalRecords.SeqPaciente,
                            ResultadoCulturas: assessment.ResultadoCulturas,
                            ResCulturasAcao: assessment.ResCulturasAcao,
                            DoseCorreta: assessment.DoseCorreta,
                            PosologiaCorreta: assessment.PosologiaCorreta,
                            AlertaDot: assessment.AlertaDot,
                            AlertaDotDescricao: assessment.AlertaDotDescricao,
                            DisfuncaoRenal: assessment.DisfuncaoRenal,
                            Hemodialise: assessment.Hemodialise,
                            AlteracaoPrescricao: assessment.AlteracaoPrescricao,
                            AtbDiluicaoInfusao: assessment.AtbDiluicaoInfusao,
                            InteracaoAtbMedicamento: assessment.InteracaoAtbMedicamento,
                            NovoAtb: assessment.NovoAtb,
                            NomePaciente: null
                        }
                    })
                    for(let i = 0; i < serializedAssessments.length; i++){
                        const patientDB = await knex("Paciente").where("SeqPaciente", serializedAssessments[i]["IdPaciente"]);
                        serializedAssessments[i]['NomePaciente'] = patientDB[0]['NomePaciente'];
                    }
                    const AssessmentLength = (await knex("Avaliacao").count('NroAvaliacao').where('NroAvaliacao', 'like', `%${nroAvaliacao}%`));
                    return response.json({showAssessments: true, assessments: serializedAssessments, length: AssessmentLength, length1: serializedAssessments.length});
                }catch(err){
                    return response.json({showAssessments: false, error: err});
                }
            }else{
                return response.json({showAssessments: false, error: "Prontuário não encontrado."});
            }         
        }

        //FILTRAR POR DataAvaliacao
        async indexByDataAvaliacao(request: Request, response: Response) {
            var { seqProntuario, dataAvaliacao } = request.query;
            if(!seqProntuario){
                return response.json({showAssessments: false, error: "Prontuário não encontrado."})
            }
            var page = String(request.query.page);
            if(!page){
                page = "10"
            }
            var pageRequest = parseInt(page) / 10;
            const rows = 10;

            const medicalRecordsDB = await knex("Prontuario").where("SeqProntuario", `${seqProntuario}`)
            const medicalRecords = medicalRecordsDB[0]

            if(medicalRecords){
                try{
                    const assessments = await knex("Avaliacao").where("IdProntuario", `${seqProntuario}`).andWhere("DataAvaliacao", "like", `%${dataAvaliacao}%`)
                    .offset((pageRequest-1)*rows).limit(rows);
            
                    var serializedAssessments = assessments.map(assessment => {
                        function trataDados(e: string) {
                            if(eval("assessment." + e) == "S"){
                                return "Sim"
                            }
                            if(eval("assessment." + e) == "NA"){
                                return "Não aplica"
                            }
                            if(eval("assessment." + e) == "N"){
                                return "Não"
                            }
                        }
                        var newAtbOral = trataDados("AtbOral")
                        var newTrocaAtb = trataDados("TrocaAtb")
                        var newAtbContraindicacao = trataDados("AtbContraindicacao")

                        return {
                            NroAvaliacao: assessment.NroAvaliacao,
                            DataAvaliacao: assessment.DataAvaliacao,
                            AtbOral: newAtbOral,
                            AtbContraindicacao: newAtbContraindicacao,
                            TrocaAtb: newTrocaAtb,
                            IdPaciente: medicalRecords.SeqPaciente,
                            ResultadoCulturas: assessment.ResultadoCulturas,
                            ResCulturasAcao: assessment.ResCulturasAcao,
                            DoseCorreta: assessment.DoseCorreta,
                            PosologiaCorreta: assessment.PosologiaCorreta,
                            AlertaDot: assessment.AlertaDot,
                            AlertaDotDescricao: assessment.AlertaDotDescricao,
                            DisfuncaoRenal: assessment.DisfuncaoRenal,
                            Hemodialise: assessment.Hemodialise,
                            AlteracaoPrescricao: assessment.AlteracaoPrescricao,
                            AtbDiluicaoInfusao: assessment.AtbDiluicaoInfusao,
                            InteracaoAtbMedicamento: assessment.InteracaoAtbMedicamento,
                            NovoAtb: assessment.NovoAtb,
                            NomePaciente: null
                        }
                    })
                    for(let i = 0; i < serializedAssessments.length; i++){
                        const patientDB = await knex("Paciente").where("SeqPaciente", serializedAssessments[i]["IdPaciente"]);
                        serializedAssessments[i]['NomePaciente'] = patientDB[0]['NomePaciente'];
                    }
                    const AssessmentLength = (await knex("Avaliacao").count('DataAvaliacao').where('DataAvaliacao', 'like', `%${dataAvaliacao}%`));
                    return response.json({showAssessments: true, assessments: serializedAssessments, length: AssessmentLength, length1: serializedAssessments.length});
                }catch(err){
                    return response.json({showAssessments: false, error: err});
                }
            }else{
                return response.json({showAssessments: false, error: "Prontuário não encontrado."});
            }         
        }
    
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

        if(!IdProntuario){
            return response.json({
                updatedAssessment: false,
                error: "Prontuário não encontrado."
            })
        }else{
            if (!NroAvaliacao || !DataAvaliacao || !DisfuncaoRenal || !Hemodialise || !AtbOral || !AtbContraindicacao || !AtbDiluicaoInfusao || !InteracaoAtbMedicamento || !TrocaAtb){
                return response.json({
                updatedAssessment: false,
                error: "Preencha todos os campos necessários."
                })
            }else{
                const medicalRecordsDB = await knex("Prontuario").where("SeqProntuario", IdProntuario)
                const medicalRecords = medicalRecordsDB[0]
    
                if(medicalRecords){
                        var DataAvaliacaoTratada = DataAvaliacao.substring(0, 10);
                        var res = DataAvaliacaoTratada.split("-")
                        var dataTratada = res[2] + "/" + res[1] + "/" + res[0]
                        var AtbOralChar
                        if(AtbOral.length == 3){
                            AtbOralChar = AtbOral[0][0]
                        }else{
                            AtbOralChar = "NA"
                        }
                        const TrocaAtbChar = TrocaAtb[0][0]
                        const AtbContraindicacaoChar = AtbContraindicacao[0][0]

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
                            AtbOral: AtbOralChar,
                            AtbContraindicacao: AtbContraindicacaoChar,
                            AlteracaoPrescricao: AlteracaoPrescricao,
                            AtbDiluicaoInfusao: AtbDiluicaoInfusao,
                            InteracaoAtbMedicamento: InteracaoAtbMedicamento,
                            TrocaAtb: TrocaAtbChar,
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