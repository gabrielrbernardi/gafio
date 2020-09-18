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
}

export {MedicalRecordsService};