import api from '../../../services/api';

class CreateMedicalRecordsService {
    async Create(NroProntuariof: any, SeqPacientef: any, DataInternacaof: string, CodDoencaPrincipalf: string,
        CodDoencaSecundariof: any, SistemaAcometidof: string, CodComorbidadef: any, Origemf: string, Alocacaof: string,
        ResultadoColetaf: any, CodAtbPrimariof: string, CodAtbSecundariof: any, SitioInfeccaoPrimariof: any,
        TratamentoCCIHf: string, IndicacaoSepsef: string, DisfuncaoRenalf: string, OrigemInfeccaof: string, 
        DoseCorretaf: any, PosologiaCorretaf: any, email:any) {
        let NroProntuario = NroProntuariof
        let SeqPaciente = SeqPacientef
        let CodDoencaSecundario = CodDoencaSecundariof
        let CodComorbidade = CodComorbidadef
        let ResultadoColeta = ResultadoColetaf
        let CodAtbSecundario = CodAtbSecundariof
        let SitioInfeccaoPrimario = SitioInfeccaoPrimariof
        let DoseCorreta = DoseCorretaf
        let PosologiaCorreta = PosologiaCorretaf
        return await api.post('medicalRecords', {
            NroProntuario, SeqPaciente, DataInternacao: DataInternacaof,
            CodDoencaPrincipal: CodDoencaPrincipalf, CodDoencaSecundario,
            SistemaAcometido: SistemaAcometidof, CodComorbidade, Origem: Origemf,
            Alocacao: Alocacaof, ResultadoColeta, CodAtbPrimario: CodAtbPrimariof,
            CodAtbSecundario, SitioInfeccaoPrimario,
            TratamentoCCIH: TratamentoCCIHf, IndicacaoSepse: IndicacaoSepsef, DisfuncaoRenal: DisfuncaoRenalf,
            OrigemInfeccao: OrigemInfeccaof, DoseCorreta, PosologiaCorreta, email
        }).then(response => response.data);
    }
}

export { CreateMedicalRecordsService };