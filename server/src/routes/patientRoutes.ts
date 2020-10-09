import express from 'express';
import PatientController from '../controllers/Patient';

const routes = express.Router();
const patient = new PatientController();

routes.post('/patient', patient.create);
routes.get('/patient/', patient.index);
routes.get('/patient/name/', patient.indexByName);
routes.get('/patient/id/', patient.indexById);
routes.get('/patient/birthday/', patient.indexByBirthday);
routes.put('/patient/update/:NroPaciente', patient.update);
routes.delete('/patient/delete/:NroPaciente', patient.delete);

export default routes;