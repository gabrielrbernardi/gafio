import api from '../../../services/api';

class NotificationsService {
    async getNotifications(CodUsuario: Number, TipoUsuario: String, endIndex: number) {
        return await api.post(`notifications/id/?id${CodUsuario}&page=${endIndex}`, { TipoUsuario: TipoUsuario }).then(response => response.data)
    }
}

export { NotificationsService };