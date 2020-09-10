import api from '../../../services/api';

class CreateMedicalRecordsService {
    async Create(medicalRecordsObject: any){
        if(typeof medicalRecordsObject["NroProntuario"] == "number" && typeof medicalRecordsObject["NroPaciente"] == "number"){
            return await api.post('medicalRecords', {
                NroProntuario: medicalRecordsObject["NroProntuario"], NroPaciente: medicalRecordsObject["NroPaciente"], DataInternacao: medicalRecordsObject["DataInternacao"],
                CodDoencaPrincipal: medicalRecordsObject["CodDoencaPrincipal"], CodDoencaSecundario: medicalRecordsObject["CodDoencaSecundario"], SistemaAcometido: medicalRecordsObject["SistemaAcometido"],
                CodComorbidade: medicalRecordsObject["CodComorbidade"], Origem: medicalRecordsObject["Origem"], Alocacao: medicalRecordsObject["Alocacao"],
                Coleta: medicalRecordsObject["Coleta"], ResultadoColeta: medicalRecordsObject["ResultadoColeta"], CodAtbPrimario: medicalRecordsObject["CodAtbPrimario"],
                CodAtbSecundario: medicalRecordsObject["CodAtbSecundario"], SitioInfeccaoPrimario: medicalRecordsObject["SitioInfeccaoPrimario"], TratamentoCCIH: medicalRecordsObject["TratamentoCCIH"],
                IndicacaoSepse: medicalRecordsObject["IndicacaoSepse"], DisfuncaoRenal: medicalRecordsObject["DisfuncaoRenal"], OrigemInfeccao: medicalRecordsObject["OrigemInfeccao"],
                DoseCorreta: medicalRecordsObject["DoseCorreta"], PosologiaCorreta: medicalRecordsObject["PosologiaCorreta"]})
            .then(response => response.data);
        }else{
            return
        }
    }
}

export {CreateMedicalRecordsService};