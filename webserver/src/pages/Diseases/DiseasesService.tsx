import api from '../../services/api';

class DiseasesService {
  async getDiseasesPaginate(endIndex: Number){
    return await api.get(`disease/paginate/${endIndex}`).then(response => response.data);
  }
}

export { DiseasesService };