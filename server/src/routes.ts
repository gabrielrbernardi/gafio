import express from 'express';
import UsuarioRoutes from './routes/userRoutes';

const app = express();

app.use(UsuarioRoutes);

export default app;