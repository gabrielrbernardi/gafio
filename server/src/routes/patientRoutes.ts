import express from 'express';
import PatientController from '../controllers/Patient';

const routes = express.Router();
const patient = new PatientController();

routes.post('/patient', patient.create);
routes.get('/patient', patient.index);
routes.get('/patient/name/:name', patient.indexByName);
routes.get('/patient/id/:id', patient.indexById);
routes.get('/patient/birthday/:birthday', patient.indexByBirthday);
routes.delete('/patient', patient.delete);

export default routes;