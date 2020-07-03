import api from '../../../services/api';

class NotificationsService{
    async getNotifications(CodUsuario: Number, TipoUsuario: String){
        return await api.post(`notifications/id/${CodUsuario}`, {TipoUsuario: TipoUsuario}).then(response => response.data)
    }
}

export {NotificationsService};