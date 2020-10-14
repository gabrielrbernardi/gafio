import api from '../../../services/api';
import Patient from './Patient';

class PatientService{
    async getPatientPaginate(endIndex: Number){
        return await api.get(`patient/?page=${endIndex}`).then(response => response.data);
    }

    // async getPatientInformations()
}

export {PatientService};