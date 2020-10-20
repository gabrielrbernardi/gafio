import api from '../../../services/api';

class AssessmentService {
    async getAssessmentPaginate(endIndex: Number){
        return await api.get(`/medicalRecords/assessment/paginate/?page=${endIndex}`).then(response => {console.log(response); return response.data});
    }
}

export {AssessmentService}