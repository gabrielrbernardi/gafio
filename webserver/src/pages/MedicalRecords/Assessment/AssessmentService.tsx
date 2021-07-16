import api from '../../../services/api';

class AssessmentService {
    async getAssessmentPaginate(queryResponse: any, endIndex: Number) {
        return await api.get(`/medicalRecords/assessment/paginate/?seqProntuario=${queryResponse}&page=${endIndex}`).then(response => { return response.data });
    }

    async searchAssessmentGlobal(queryResponse: any, searchKey: String, searchCode: String, first: number) {
        if (searchCode === 'Nro') {
            return await api.get(`/medicalRecords/assessment/nroAvaliacao/?seqProntuario=${queryResponse}&nroAvaliacao=${searchKey}&page=${first}`).then(response => response.data);
        } else if (searchCode === 'Dat') {
            return await api.get(`/medicalRecords/assessment/dataAvaliacao/?seqProntuario=${queryResponse}&dataAvaliacao=${searchKey}&page=${first}`).then(response => response.data);
        }
    }

    async Update(queryResponse: any, getNroAvaliacao: any, getDataAvaliacao: string, getResultadoCulturas: any, getResCulturasAcao: any,
        getDoseCorreta: any, getPosologiaCorreta: any, getAlertaDot: any, getAlertaDotDescricao: any, getDisfuncaoRenal: string, getHemodialise: string,
        getAtbOral: string, getAtbContraindicacao: string, getAlteracaoPrescricao: any, getAtbDiluicaoInfusao: string, getInteracaoAtbMedicamento: string,
        getTrocaAtb: string, getNovoAtb: any) {
            return await api.put('medicalRecords/assessment/update', {
            IdProntuario: queryResponse, NroAvaliacao: getNroAvaliacao, DataAvaliacao: getDataAvaliacao,
            ResultadoCulturas: getResultadoCulturas, ResCulturasAcao: getResCulturasAcao, DoseCorreta: getDoseCorreta, 
            PosologiaCorreta: getPosologiaCorreta, AlertaDot: getAlertaDot, AlertaDotDescricao: getAlertaDotDescricao, 
            DisfuncaoRenal: getDisfuncaoRenal, Hemodialise: getHemodialise, AtbOral: getAtbOral, 
            AtbContraindicacao: getAtbContraindicacao, AlteracaoPrescricao: getAlteracaoPrescricao, 
            AtbDiluicaoInfusao: getAtbDiluicaoInfusao, InteracaoAtbMedicamento: getInteracaoAtbMedicamento, 
            TrocaAtb: getTrocaAtb, NovoAtb: getNovoAtb
        }).then(response => response.data)
    }

    async Delete(getNroAvaliacao: any) {
        return await api.post('medicalRecords/assessment/delete', { 
            NroAvaliacao: getNroAvaliacao
        }).then(response => response.data);
    }

    async Verify(queryResponse: any){
        return await api.post('/medicalRecords/assessment/verify/', { 
            seqProntuario: queryResponse
        }).then(response => response.data)
    }
}

export { AssessmentService }