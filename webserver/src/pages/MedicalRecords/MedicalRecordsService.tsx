import api from '../../services/api';

class MedicalRecordsService {
    async getUsers(){
        return await api.get('users').then(response => response.data);
    }
}

export {MedicalRecordsService};