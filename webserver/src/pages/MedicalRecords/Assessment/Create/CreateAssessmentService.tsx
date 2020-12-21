import api from '../../../../services/api'

class CreateAssessmentService {
    async Create(queryResponse: any, getNroAvaliacao: any, getDataAvaliacao: string, getResultadoCulturas: any, getResCulturasAcao: any,
        getDoseCorreta: any, getPosologiaCorreta: any, getAlertaDot: any, getAlertaDotDescricao: any, getDisfuncaoRenal: string, getHemodialise: string,
        getAtbOral: string, getAtbContraindicacao: string, getAlteracaoPrescricao: any, getAtbDiluicaoInfusao: string, getInteracaoAtbMedicamento: string,
        getTrocaAtb: string, getNovoAtb: any) {
        return await api.post('medicalRecords/assessment', {
            IdProntuario: queryResponse, NroAvaliacao: getNroAvaliacao, DataAvaliacao: getDataAvaliacao,
            ResultadoCulturas: getResultadoCulturas, ResCulturasAcao: getResCulturasAcao, DoseCorreta: getDoseCorreta, 
            PosologiaCorreta: getPosologiaCorreta, AlertaDot: getAlertaDot, AlertaDotDescricao: getAlertaDotDescricao, 
            DisfuncaoRenal: getDisfuncaoRenal, Hemodialise: getHemodialise, AtbOral: getAtbOral, 
            AtbContraindicacao: getAtbContraindicacao, AlteracaoPrescricao: getAlteracaoPrescricao, 
            AtbDiluicaoInfusao: getAtbDiluicaoInfusao, InteracaoAtbMedicamento: getInteracaoAtbMedicamento, 
            TrocaAtb: getTrocaAtb, NovoAtb: getNovoAtb
        }).then(response => response.data)
    }

    async Verify(queryResponse: any){
        return await api.post('/medicalRecords/assessment/verify/', { 
            seqProntuario: queryResponse 
        }).then(response => response.data)
    }
}

export { CreateAssessmentService }