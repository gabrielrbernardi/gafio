import express from 'express';
import UsuarioRoutes from './routes/userRoutes';
import DiseaseRoutes from './routes/diseaseRoutes';
import NotificationRoutes from './routes/notificationRoutes';

const app = express();

app.use(UsuarioRoutes);
app.use(DiseaseRoutes);
app.use(NotificationRoutes);

export default app;