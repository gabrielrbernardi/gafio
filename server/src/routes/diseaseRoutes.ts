import express from 'express';
import DiseasesController from '../controllers/Diseases';

const routes = express.Router();
const diseasesController = new DiseasesController();

routes.post('/diseases', diseasesController.create);
routes.post('/diseases/importDB', diseasesController.importDB);

routes.get('/diseases', diseasesController.index);
routes.get('/diseases/name/:name', diseasesController.indexByName);
routes.get('/diseases/diseaseCode/:diseaseCode', diseasesController.indexByCode);
routes.get('/diseases/paginate', diseasesController.indexByPage);
routes.get('/diseases/info', diseasesController.searchDiseaseData);

routes.put('/diseases/:id', diseasesController.update);

routes.delete('/diseases', diseasesController.delete);
routes.delete('/diseases/deleteAll', diseasesController.deleteAll);

export default routes;