import api from '../../../../services/api';

class CreateDiseaseService {

    async Create(
        codDoenca: string,
        nome: string
    ) {
        return await api.post('diseases', {
            codDoenca,
            nome
        }).then(response => response.data);
    }
}

export { CreateDiseaseService };