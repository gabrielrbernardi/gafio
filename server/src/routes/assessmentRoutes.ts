import express from "express"
import AvaliacaoController from "../controllers/Assessment"

const routes = express.Router()
const assessments = new AvaliacaoController()

routes.post("/medicalRecords/assessment", assessments.create)
routes.get("/medicalRecords/assessment", assessments.index)

routes.get("/medicalRecords/assessment/paginate/", assessments.indexPagination)

routes.get("/medicalRecords/assessment/nroAvaliacao/", assessments.indexByNroAvaliacao)
routes.get("/medicalRecords/assessment/dataAvaliacao/", assessments.indexByDataAvaliacao)

routes.post("/medicalRecords/assessment/verify/", assessments.verifyMedicalRecords)

routes.put("/medicalRecords/assessment/update", assessments.update)
routes.post("/medicalRecords/assessment/delete", assessments.delete)

export default routes;