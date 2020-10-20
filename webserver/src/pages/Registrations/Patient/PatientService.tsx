import api from '../../../services/api';
import Patient from './Patient';

class PatientService{
    async getPatientPaginate(endIndex: Number){
        return await api.get(`patient/?page=${endIndex}`).then(response => response.data);
    }

    async getPatientInformation(idPatient: Number){
        return await api.get(`patient/search/searchPatientData/?id=${idPatient}&page=10`).then(response => response.data);
    }

    async updatePatientInformation(IdPaciente: Number, NomePaciente: string, Genero: string, DataNascimento: Date){
        return await api.put(`/patient/update/${IdPaciente}`, {NomePaciente, Genero, DataNascimento}).then(response => {
            return response.data;
        }).catch((err) => {
            return {error: err};
        })
    }
}

export {PatientService};