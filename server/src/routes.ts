import express from 'express';
import Usuario from './controllers/Usuario';

const routes = express.Router();

const usuario = new Usuario();

routes.get('/users', usuario.index);

export default routes;