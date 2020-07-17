import api from '../../services/api';

class UsersService {
    async getUsersPaginate(endIndex: Number){
        return await api.get(`users/paginate/${endIndex}`).then(response => response.data);
    }

    async deleteUser(CodUsuario: Number, Email: string){
        console.log(Email)
        return await api.post('users/delete', {Email: Email}).then(response => response.data);
    }
}

export {UsersService};