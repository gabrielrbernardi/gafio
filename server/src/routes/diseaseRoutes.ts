import express from 'express';
import DiseasesController from '../controllers/Diseases';

const routes = express.Router();
const diseasesController = new DiseasesController();

routes.post('/diseases', diseasesController.create);
routes.post('/diseases/importDB', diseasesController.importDB);

routes.get('/diseases/name/', diseasesController.indexByName);
routes.get('/diseases/code/', diseasesController.indexByCode);
routes.get('/diseases/page/', diseasesController.indexByPage);
routes.get('/diseases/info/', diseasesController.diseaseInfo);

routes.put('/diseases/:id', diseasesController.update);

routes.delete('/diseases/:id', diseasesController.delete);

export default routes;