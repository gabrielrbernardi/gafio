import api from '../../services/api';
import axios from 'axios';

class DiseasesService {
  async getDiseasesService () {
    // return await api.get('disease').then(response => response.data);
    return await axios.get('http://cid10-api.herokuapp.com/cid10').then(response => response.data);
  }
}

export { DiseasesService };