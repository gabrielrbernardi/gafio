import express from 'express';
import DiseasesController from '../controllers/Diseases';

const routes = express.Router();
const diseases = new DiseasesController();

routes.post('/diseases', diseases.create);
routes.post('/diseases/importDB', diseases.importDB);
routes.get('/diseases', diseases.index);
routes.get('/diseases/name/:name', diseases.indexByName);
routes.get('/diseases/diseaseCode/:diseaseCode', diseases.indexByCode);
routes.get('/diseases/paginate/:page', diseases.indexByPage);
routes.delete('/diseases', diseases.delete);
routes.delete('/diseases/deleteAll', diseases.deleteAll);

export default routes;