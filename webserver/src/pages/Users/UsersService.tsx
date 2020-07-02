import api from '../../services/api';



class UsersService {
    async getUsers(){
        return await api.get('users').then(response => response.data);
    }

    // async deleteUser(CodUsuario: Number, Email: string){
    //     console.log(Email)
    //     await api.delete('users', {Email: Email}).then(response=>{
    //         console.log(Email)
    //         console.log( response );
    //     })
    // }
}

export {UsersService};