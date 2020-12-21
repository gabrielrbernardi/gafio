import api from '../../services/api';

class MedicalRecordsService {
    async getMedicalRecordsPaginate(endIndex: Number) {
        return await api.get(`medicalRecords/paginate/?page=${endIndex}`).then(response => response.data);
    }

    async searchMedicalRecordsGlobal(searchKey: String, searchCode: String, first: number) {
        if (searchCode === 'Pro') {
            return await api.get(`medicalRecords/nroProntuario/?nroProntuario=${searchKey}&page=${first}`).then(response => response.data);
        } else if (searchCode === 'Pac') {
            return await api.get(`medicalRecords/seqPaciente/?seqPaciente=${searchKey}&page=${first}`).then(response => response.data);
        } else if (searchCode === 'Int') {
            return await api.get(`medicalRecords/dataInternacao/?dataInternacao=${searchKey}&page=${first}`).then(response => response.data);
        }
    }

    async Update(getNroProntuario: any, getSeqPaciente: any, getDataInternacao: string, getCodDoencaPrincipal: string,
        getCodDoencaSecundario: any, getSistemaAcometido: string, getCodComorbidade: any, getOrigem: string, getAlocacao: string,
        getResultadoColeta: any, getCodAtbPrimario: string, getCodAtbSecundario: any, getSitioInfeccaoPrimario: any,
        getTratamento: string, getIndicacao: string, getDisfuncao: string, getOrigemInfeccao: string, 
        getDose: any, getPosologia: any, email:any) {
            return await api.put('medicalRecords/update', {
            NroProntuario: getNroProntuario, SeqPaciente: getSeqPaciente, DataInternacao: getDataInternacao,
            CodDoencaPrincipal: getCodDoencaPrincipal, CodDoencaSecundario: getCodDoencaSecundario,
            SistemaAcometido: getSistemaAcometido, CodComorbidade: getCodComorbidade, Origem: getOrigem, 
            Alocacao: getAlocacao, ResultadoColeta: getResultadoColeta, CodAtbPrimario: getCodAtbPrimario,
            CodAtbSecundario: getCodAtbSecundario, SitioInfeccaoPrimario: getSitioInfeccaoPrimario, 
            TratamentoCCIH: getTratamento, IndicacaoSepse: getIndicacao, DisfuncaoRenal: getDisfuncao, 
            OrigemInfeccao: getOrigemInfeccao, DoseCorreta: getDose, PosologiaCorreta: getPosologia, email: email
        }).then(response => response.data);
    }

    async Delete(getNroProntuario: any, email:any) {
        return await api.post('medicalRecords/delete', { NroProntuario: getNroProntuario, email: email })
            .then(response => response.data);
    }

    async Desfecho(getNroProntuario: any, getDesfecho: any, getDataDesfecho: string, email:any) {
        return await api.put('medicalRecords/desfecho', { NroProntuario: getNroProntuario, 
            Desfecho: getDesfecho, DataDesfecho: getDataDesfecho, email: email
        }).then(response => response.data);
    }

}

export { MedicalRecordsService };