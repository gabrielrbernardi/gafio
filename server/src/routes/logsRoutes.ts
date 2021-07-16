import express from "express";
import LogsController from "../controllers/ShowLogs";

const routes = express.Router();
const logs = new LogsController();

//Routes to User CRUD
routes.get("/logs/login", logs.showUserLogs);
routes.post("/logs/microbiology", logs.showMicrobiologyLogs);
routes.post("/logs/patient", logs.showPatientLogs);
routes.post("/logs/medicalRecords", logs.showMedicalRecordsLogs);

export default routes;
