import express from "express"
import AvaliacaoController from "../controllers/Assessment"

const routes = express.Router()
const assessments = new AvaliacaoController()

routes.post("/assessment", assessments.create)
routes.get("/assessment", assessments.index)

routes.get("/assessment/paginate/", assessments.indexPagination)

routes.put("/assessment/update", assessments.update)
routes.post("/assessment/delete", assessments.delete)

export default routes;