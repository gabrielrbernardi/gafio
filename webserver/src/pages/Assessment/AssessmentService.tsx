import api from '../../services/api';

class AssessmentService {
    async getAssessmentPaginate(endIndex: Number){
        return await api.get(`/assessments/paginate/?page=${endIndex}`).then(response => response.data);
    }
}

export {AssessmentService}