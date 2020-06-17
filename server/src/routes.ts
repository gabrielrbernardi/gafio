import express from 'express';
import UsuarioRoutes from './routes/userRoutes';
import DiseaseRoutes from './routes/diseaseRoutes';

const app = express();

app.use(UsuarioRoutes);
app.use(DiseaseRoutes);

export default app;