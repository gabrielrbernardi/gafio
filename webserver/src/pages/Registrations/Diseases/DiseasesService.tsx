import api from '../../../services/api';

class DiseasesService {

    async getDiseasesPaginate(endIndex: Number) {
        return await api.get(`diseases/paginate/${endIndex}`).then(response => response.data);
    }

    async searchDiseasesGlobal(searchKey: String, searchCode: String, first: number) {
        if (searchCode === 'C') {
            return await api.get(`diseases/diseaseCode/${searchKey}?page=${first}`).then(response => response.data);
        }
        else if (searchCode === 'N') {
            return await api.get(`diseases/name/${searchKey}`).then(response => response.data);
        }
    }

    async updateDiseasesDB() {
        const updatedDiseasesDB = await api.get("https://cid10-api.herokuapp.com/cid10");
        const currentDiseasesDB = await api.get("diseases").then(response => response.data);

        if (updatedDiseasesDB.data.length !== currentDiseasesDB.length) {
            await api.delete('/diseases/deleteAll');
            await api.post('/diseases/importDB');

            alert("Banco de dados foi atualizado");
        }
    }

    async getDiseaseInformation(codDoenca: Number) {
        return await api.get(`diseases/search/searchPatientData/?id=${codDoenca}&page=10`).then(response => response.data);
    }

    async updateDiseaseInformation(codDoenca: Number, nome: string) {
        return await api.put(`/diseases/update/${codDoenca}`, { codDoenca, nome }).then(response => {
            return response.data;
        }).catch((err) => {
            return { error: err };
        });
    }

}

export { DiseasesService };