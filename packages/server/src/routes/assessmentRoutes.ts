import express from "express"
import AvaliacaoController from "../controllers/Assessment"

const routes = express.Router()
const assessments = new AvaliacaoController()

routes.post("/assessments", assessments.create)
routes.get("/assessments", assessments.index)

routes.get("/assessments/paginate/", assessments.indexPagination)

routes.put("/assessments/update", assessments.update)
routes.post("/assessments/delete", assessments.delete)

export default routes;