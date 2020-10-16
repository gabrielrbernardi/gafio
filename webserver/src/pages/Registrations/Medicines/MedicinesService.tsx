import api from "../../../services/api";

class MedicineService {

  async getMedicinesPaginate(endIndex: Number){
    return await api.get(`medicines/paginate/${endIndex}`).then(response => response.data);
  }

  async searchMedicineGlobal(searchKey: String, searchCode: String, first: number){
    if (searchCode === 'E') {
      return await api.get(`medicines/ean/${searchKey}&page=${first}`).then(response => response.data);
    }
    else if (searchCode === 'P') {
      return await api.get(`medicines/principio/${searchKey}`).then(response => response.data);
    } 
    else if (searchCode === 'C') {
      return await api.get(`medicines/classe/${searchKey}`).then(response => response.data);
    }  
  }

  async getMedicineService() {
    return await api.get("medicines").then((response) => response.data);
  }

}

export { MedicineService };
