import api from '../../../services/api';
import Patient from './Patient';

class PatientService {
    async getPatientPaginate(endIndex: Number) {
        return await api.get(`patient/?page=${endIndex}`).then(response => response.data);
    }

    async getPatientInformation(idPatient: Number) {
        return await api.get(`patient/search/searchPatientData/?id=${idPatient}&page=10`).then(response => response.data);
    }

    async updatePatientInformation(IdPaciente: Number, NomePaciente: string, Genero: string, DataNascimento: Date, email:any) {
        return await api.put(`/patient/update/${IdPaciente}`, { NomePaciente, Genero, DataNascimento, email}).then(response => {
            return response.data;
        }).catch((err) => {
            return { error: err };
        })
    }

    async deletePatient(IdPaciente: Number, email:any) {
        return await api.delete(`/patient/delete/${IdPaciente}/${email}`).then(response => {
            return response.data;
        }).catch(err => {
            return { error: err };
        })
    }

    async searchPatientGlobal(searchKey: String, searchCode: String, first: number){
        if (searchCode === 'Name') {
            return await api.get(`/patient/name/?name=${searchKey}&page=${first}`).then(response => response.data);
        } else if (searchCode === 'Nro') {
            return await api.get(`/patient/id/?nroPaciente=${searchKey}&page=${first}`).then(response => response.data);
        } else if (searchCode === 'Nas') {
            return await api.get(`/patient/birthday/?dataNascimento=${searchKey}&page=${first}`).then(response => response.data);
        }
    }
}

export { PatientService };