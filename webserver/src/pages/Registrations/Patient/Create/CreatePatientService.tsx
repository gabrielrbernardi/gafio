import api from '../../../../services/api';

class CreatePatientService{
    async create(NroPaciente: Number, NomePaciente: String, DataNascimento: String, GeneroPaciente: String){
        return await api.post('/patient', {NroPaciente, NomePaciente, DataNascimento, Genero: GeneroPaciente}).then(response => response.data)
    }
}

export {CreatePatientService};