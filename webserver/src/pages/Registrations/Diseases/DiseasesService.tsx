import api from '../../../services/api';

class DiseasesService {

    async getDiseasesPaginate(endIndex: Number) {
        return await api.get(`diseases/page/?page=${endIndex}`).then(response => response.data);
    }

    async searchDiseasesGlobal(searchKey: String, searchCode: String, first: number) {
        if (searchCode === "C") {
            return await api.get(`diseases/code/?code=${searchKey}`).then(response => response.data);
        }
        else if (searchCode === "N") {
            return await api.get(`diseases/name/?name=${searchKey}`).then(response => response.data);
        }
    }

    async getDiseaseInformation(codDoenca: Number) {
        return await api.get(`diseases/info/?id=${codDoenca}`).then(response => response.data);
    }

    async updateDisease(codDoenca: Number, nome: string) {
        return await api.put(`/diseases/${codDoenca}`, { codDoenca, nome }).then(response => {
            return response.data;
        })
        .catch((err) => {
            return { error: err };
        });
    }

    async deleteDisease(codDoenca: String) {
        return await api.delete(`/diseases/${codDoenca}`).then(response => {
            return response.data;
        })
        .catch(err => {
            return { error: err };
        })
    }

    async updateDiseasesDB() {
        const updatedDiseasesDB = await api.get("https://cid10-api.herokuapp.com/cid10");
        const currentDiseasesDB = await api.get("diseases").then(response => response.data);

        if (updatedDiseasesDB.data.length !== currentDiseasesDB.length) {
            await api.delete("/diseases/deleteAll");
            await api.post("/diseases/importDB");

            alert("Banco de dados foi atualizado");
        }
    }

}

export { DiseasesService };