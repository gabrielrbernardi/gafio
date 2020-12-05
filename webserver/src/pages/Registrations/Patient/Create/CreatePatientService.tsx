import api from '../../../../services/api';

class CreatePatientService{
    async create(NroPaciente: Number, NomePaciente: String, DataNascimento: String, GeneroPaciente: String, email: any) {
        return await api.post('/patient', {NroPaciente, NomePaciente, DataNascimento, Genero: GeneroPaciente, email}).then(response => response.data)
    }
}

export {CreatePatientService};