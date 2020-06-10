import express from 'express';
import UsuarioController from '../controllers/User';

const routes = express.Router();
const usuario = new UsuarioController();

routes.get('/users', usuario.index);
routes.get('/users/id/:id', usuario.showId);
routes.get('/users/email/:email', usuario.showEmail);
routes.post('/users', usuario.create);
routes.put('/users/:id', usuario.update);
routes.delete('/users', usuario.delete);

export default routes;