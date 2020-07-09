import api from '../../services/api';

class DiseasesService {
  async getDiseasesService () {
    return await api.get('disease').then(response => response.data);
  }
}

export { DiseasesService };