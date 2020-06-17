import express from 'express';
import DiseaseController from '../controllers/Disease';

const routes = express.Router();
const disease = new DiseaseController();

routes.post('/disease', disease.create);
routes.get('/disease', disease.index);
routes.delete('/disease', disease.delete);

export default routes;