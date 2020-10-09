import express from 'express';
import Config from '../controllers/Config';

const routes = express.Router();
const config = new Config();

routes.get('/serverStatus', config.connectionTestFunction);


export default routes;