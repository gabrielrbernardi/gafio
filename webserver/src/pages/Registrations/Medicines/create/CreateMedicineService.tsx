import api from '../../../../services/api';

class CreateMedicineService {

    async Create(
        EAN: string,
        PrincipioAtivo: string,
        Registro: string,
        Laboratorio: string,
        Produto: string,
        Apresentacao: string,
        ClasseTerapeutica: string,
        CNPJ: string,
        email:any
    ) {
        return await api.post('medicines', {
            EAN,
            PrincipioAtivo,
            Registro,
            Laboratorio,
            Produto,
            Apresentacao,
            ClasseTerapeutica,
            CNPJ,
            email
        }).then(response => response.data);
    }
}

export { CreateMedicineService };