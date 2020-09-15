import api from '../../services/api';

class MedicalRecordsService {
    async getMedicalRecordsPaginate(endIndex: Number){
        return await api.get(`medicalRecords/paginate/${endIndex}`).then(response => response.data);
    }
}

export {MedicalRecordsService};