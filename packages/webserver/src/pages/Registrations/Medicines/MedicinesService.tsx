import api from "../../../services/api";

class MedicineService {
   async getMedicineService() {
      return await api.get("medicines").then((response) => response.data);
   }
}

export { MedicineService };
