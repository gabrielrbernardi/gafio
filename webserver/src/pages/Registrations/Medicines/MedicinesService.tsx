import api from "../../../services/api";

class MedicinesService {

    async getMedicinesPaginate(endIndex: Number) {
        return await api.get(`medicines/page/?page=${endIndex}`).then(response => response.data);
    }

    async searchMedicineGlobal(searchKey: String, searchCode: String, first: number) {
        if (searchCode === 'E') {
            return await api.get(`medicines/ean/?ean=${searchKey}`).then(response => response.data);
        }
        else if (searchCode === 'P') {
            return await api.get(`medicines/principle/?principle=${searchKey}`).then(response => response.data);
        }
        else if (searchCode === 'C') {
            return await api.get(`medicines/class/?medicineClass=${searchKey}`).then(response => response.data);
        }
    }

    async getMedicineService() {
        return await api.get("medicines").then((response) => response.data);
    }

}

export { MedicinesService };
