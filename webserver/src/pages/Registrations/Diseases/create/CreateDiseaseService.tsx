import api from '../../../../services/api';

class CreateDiseaseService {

    async Create(
        codDoenca: string,
        nome: string,
        email:any
    ) {
        return await api.post('diseases', {
            codDoenca,
            nome,
            email
        }).then(response => response.data);
    }
}

export { CreateDiseaseService };