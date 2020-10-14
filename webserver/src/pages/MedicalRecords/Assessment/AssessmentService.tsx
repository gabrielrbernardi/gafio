import api from '../../../services/api';

class AssessmentService {
    async getAssessmentPaginate(endIndex: Number){
        return await api.get(`/assessment/paginate/?page=${endIndex}`).then(response => {console.log(response); return response.data});
    }
}

export {AssessmentService}