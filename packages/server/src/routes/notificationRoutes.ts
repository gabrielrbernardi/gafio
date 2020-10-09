import express from "express";
import NotificationController from "../controllers/Notification";

const routes = express.Router();
const notification = new NotificationController();

//Routes to User CRUD
routes.get("/notifications", notification.index);
routes.post("/notifications/id/", notification.showId);
routes.get('/notifications/length/:id', notification.showNotificationLength);
routes.post("/notifications", notification.create);
routes.put("/notifications/status/:id", notification.updateStatus);
routes.put("/notifications/status/accept/:id", notification.updateStatusAccepted);
routes.put("/notifications/status/refuse/:id", notification.updateStatusRefused);
routes.delete("/notifications/:id", notification.delete);

export default routes;
