import api from '../../services/api';

class MedicalRecordsService {
    async getMedicalRecordsPaginate(endIndex: Number){
        return await api.get(`medicalRecords/paginate/?page=${endIndex}`).then(response => response.data);
    }

    async searchMedicalRecordsGlobal(searchKey: String, searchCode: String, first: number){
        if(searchCode === 'Pro'){
            return await api.get(`medicalRecords/nroProntuario/?nroProntuario=${searchKey}&page=${first}`).then(response => response.data);
        }else if(searchCode === 'Pac'){
            return await api.get(`medicalRecords/nroPaciente/?nroPaciente=${searchKey}&page=${first}`).then(response => response.data);
        }else if(searchCode === 'Int'){
            return await api.get(`medicalRecords/dataInternacao/?dataInternacao=${searchKey}&page=${first}`).then(response => response.data);
        }
    }

    async Update(NroProntuariof: any, SeqPacientef: any, DataInternacaof: string, CodDoencaPrincipalf: string,
        CodDoencaSecundariof: any, SistemaAcometidof: string, CodComorbidadef: any, Origemf: string, Alocacaof: string,
        ResultadoColetaf: any, CodAtbPrimariof: string, CodAtbSecundariof: any, SitioInfeccaoPrimariof: any,
        TratamentoCCIHf: string, IndicacaoSepsef: string, DisfuncaoRenalf: string, OrigemInfeccaof: string,
        DoseCorretaf: any, PosologiaCorretaf: any){
        let NroProntuario = NroProntuariof
        let SeqPaciente = SeqPacientef
        let CodDoencaSecundario = CodDoencaSecundariof
        let CodComorbidade = CodComorbidadef
        let ResultadoColeta = ResultadoColetaf
        let CodAtbSecundario = CodAtbSecundariof
        let SitioInfeccaoPrimario = SitioInfeccaoPrimariof
        let DoseCorreta = DoseCorretaf
        let PosologiaCorreta = PosologiaCorretaf
    return await api.put('medicalRecords/update', {
        NroProntuario, SeqPaciente, DataInternacao: DataInternacaof,
        CodDoencaPrincipal: CodDoencaPrincipalf, CodDoencaSecundario,
        SistemaAcometido: SistemaAcometidof, CodComorbidade, Origem: Origemf, 
        Alocacao: Alocacaof, ResultadoColeta, CodAtbPrimario: CodAtbPrimariof,
        CodAtbSecundario, SitioInfeccaoPrimario,
        TratamentoCCIH: TratamentoCCIHf, IndicacaoSepse: IndicacaoSepsef, DisfuncaoRenal: DisfuncaoRenalf,
        OrigemInfeccao: OrigemInfeccaof, DoseCorreta, PosologiaCorreta})
    .then(response => response.data);
    }

    async Delete(NroProntuariof: any){
        let NroProntuario = NroProntuariof
        return await api.post('medicalRecords/delete', {NroProntuario})
            .then(response => response.data);
    }

    async Desfecho(NroProntuariof: any,  Desfechof: any, DataDesfechof: string){
        let NroProntuario = NroProntuariof
        let Desfecho = Desfechof
        return await api.put('medicalRecords/desfecho', {NroProntuario, Desfecho, DataDesfecho: DataDesfechof})
            .then(response => response.data);
    }

}

export {MedicalRecordsService};