import api from '../../../services/api';

class DiseasesService {

  async getDiseasesPaginate(endIndex: Number){
    return await api.get(`disease/paginate/${endIndex}`).then(response => response.data);
  }
  
  async searchDiseaseGlobal(searchKey: String, searchCode: String, first: number){
    if(searchCode === 'C') {
      return await api.get(`users/id/?id=${searchKey}&page=${first}`).then(response => response.data);
    }
    else if (searchCode === 'N') {
      return await api.get(`disease/name/${searchKey}`).then(response => response.data);
    }  
  }
}

export { DiseasesService };