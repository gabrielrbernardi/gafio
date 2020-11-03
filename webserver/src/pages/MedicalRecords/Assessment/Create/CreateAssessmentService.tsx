import api from '../../../../services/api'

class CreateAssessmentService {
    async Create(IdProntuariof: any, NroAvaliacaof: any, DataAvaliacaof: string, ResultadoCulturasf: any, ResCulturasAcaof: any,
        DoseCorretaf: any, PosologiaCorretaf: any, AlertaDotf: any, AlertaDotDescricaof: any, DisfuncaoRenalf: string, Hemodialisef: string,
        AtbOralf: string, AtbContraindicacaof: string, AlteracaoPrescricaof: any, AtbDiluicaoInfusaof: string, InteracaoAtbMedicamentof: string,
        TrocaAtbf: string, NovoAtbf: any) {
        let IdProntuario = IdProntuariof
        let NroAvaliacao = NroAvaliacaof
        let ResultadoCulturas = ResultadoCulturasf
        let ResCulturasAcao = ResCulturasAcaof
        let DoseCorreta = DoseCorretaf
        let PosologiaCorreta = PosologiaCorretaf
        let AlertaDot = AlertaDotf
        let AlertaDotDescricao = AlertaDotDescricaof
        let AlteracaoPrescricao = AlteracaoPrescricaof
        let NovoAtb = NovoAtbf
        return await api.post('medicalRecords/assessment', {
            IdProntuario, NroAvaliacao, DataAvaliacao: DataAvaliacaof, ResultadoCulturas, ResCulturasAcao,
            DoseCorreta, PosologiaCorreta, AlertaDot, AlertaDotDescricao, DisfuncaoRenal: DisfuncaoRenalf,
            Hemodialise: Hemodialisef, AtbOral: AtbOralf, AtbContraindicacao: AtbContraindicacaof,
            AlteracaoPrescricao, AtbDiluicaoInfusao: AtbDiluicaoInfusaof, InteracaoAtbMedicamento: InteracaoAtbMedicamentof,
            TrocaAtb: TrocaAtbf, NovoAtb
        }).then(response => response.data)
    }
}

export { CreateAssessmentService }