import api from '../../services/api';

class UsersService {
    async getUsersPaginate(endIndex: Number){
        return await api.get(`users/paginate/${endIndex}`).then(response => response.data);
    }

    async deleteUser(CodUsuario: Number, Email: string){
        return await api.post('users/delete', {Email: Email}).then(response => response.data);
    }

    async searchUserGlobal(searchKey: String, searchCode: String){
        if(searchCode === 'C'){
            return await api.get(`users/id/${searchKey}`).then(response => response.data);
        }else if(searchCode === 'N'){
            return await api.get(`users/name/${searchKey}`).then(response => response.data);
        }else if(searchCode === 'E'){
            return await api.get(`users/email/${searchKey}`).then(response => response.data);
        }else if(searchCode === 'M'){
            return await api.get(`users/registrations/${searchKey}`).then(response => response.data);
        }else if(searchCode === 'TU'){
            return await api.get(`users/userType/${searchKey}`).then(response => response.data);
        }
    }
    
    async changeUserType(userId: Number, newUserType: string){
        return await api.post('users/changeUserType', {userId: userId, newUserType: newUserType}).then(response => response.data);
    }

    async changeVerifyUser(userId: Number, newUserType: string){
        return await api.post(`users/changeVerifyUser`, {userId: userId, verifyUserOption: newUserType}).then(response => response.data);
    }
}

export {UsersService};