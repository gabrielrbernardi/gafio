import express from 'express';
import UsuarioController from '../controllers/User';

const routes = express.Router();
const usuario = new UsuarioController();

routes.get('/users', usuario.index);
routes.get('/users/:id', usuario.show);
routes.post('/users', usuario.create);

export default routes;