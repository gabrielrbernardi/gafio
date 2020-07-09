import api from '../../services/api';

class UsersService {
    async getUsers(){
        return await api.get('users').then(response => response.data);
    }

    async deleteUser(CodUsuario: Number, Email: string){
        console.log(Email)
        return await api.post('users/delete', {Email: Email}).then(response => response.data);
    }
}

export {UsersService};