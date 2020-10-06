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

  async updateDiseaseDB() {
    const updatedDiseaseDB = await api.get("https://cid10-api.herokuapp.com/cid10");
    const currentDiseaseDB = await api.get("disease").then(response => response.data);

    if (updatedDiseaseDB.data.length !== currentDiseaseDB.length) {
      await api.delete('/disease/deleteAll');
      await api.post('/disease/importDB');
      alert("Banco de dados foi atualizado");
    }
  }
}

export { DiseasesService };