import express from 'express';
import Usuario from './controllers/Usuario';

const routes = express.Router();

const usuario = new Usuario();

routes.get('/usuarios', usuario.index);
routes.post('/usuarios', usuario.create);

export default routes;