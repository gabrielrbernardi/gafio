import api from '../../../services/api';

class CreateMedicalRecordsService {
    async Create(getNroProntuario: any, getSeqPaciente: any, getDataInternacao: string, getCodDoencaPrincipal: string,
        getCodDoencaSecundario: any, getSistemaAcometido: string, getCodComorbidade: any, getOrigem: string, getAlocacao: string,
        getResultadoColeta: any, getCodAtbPrimario: string, getCodAtbSecundario: any, getSitioInfeccaoPrimario: any,
        getTratamento: string, getIndicacao: string, getDisfuncao: string, getOrigemInfeccao: string, 
        getDose: any, getPosologia: any, email:any) {
        return await api.post('medicalRecords', {
            NroProntuario: getNroProntuario, SeqPaciente: getSeqPaciente, DataInternacao: getDataInternacao,
            CodDoencaPrincipal: getCodDoencaPrincipal, CodDoencaSecundario: getCodDoencaSecundario,
            SistemaAcometido: getSistemaAcometido, CodComorbidade: getCodComorbidade, Origem: getOrigem, 
            Alocacao: getAlocacao, ResultadoColeta: getResultadoColeta, CodAtbPrimario: getCodAtbPrimario,
            CodAtbSecundario: getCodAtbSecundario, SitioInfeccaoPrimario: getSitioInfeccaoPrimario, 
            TratamentoCCIH: getTratamento, IndicacaoSepse: getIndicacao, DisfuncaoRenal: getDisfuncao, 
            OrigemInfeccao: getOrigemInfeccao, DoseCorreta: getDose, PosologiaCorreta: getPosologia, email: email
        }).then(response => response.data);
    }
}

export { CreateMedicalRecordsService };