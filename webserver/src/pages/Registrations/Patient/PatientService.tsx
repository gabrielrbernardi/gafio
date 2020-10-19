import api from '../../../services/api';
import Patient from './Patient';

class PatientService{
    async getPatientPaginate(endIndex: Number){
        return await api.get(`patient/?page=${endIndex}`).then(response => response.data);
    }

    async getPatientInformation(idPatient: Number){
        return await api.get(`patient/search/searchPatientData/?id=${idPatient}&page=10`).then(response => response.data);
    }
}

export {PatientService};