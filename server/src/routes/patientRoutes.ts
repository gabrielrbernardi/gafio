import express from 'express';
import PatientController from '../controllers/Patient';

const routes = express.Router();
const patient = new PatientController();

routes.post('/patient', patient.create);
routes.get('/patient', patient.index);
routes.delete('/patient', patient.delete);

export default routes;