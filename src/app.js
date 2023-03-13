import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import administrador from './routes/administrador.routes.js';
import usuarios from './routes/usuarios.routes.js';
import casas from './routes/casas.routes.js';

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(administrador);
app.use(usuarios);
app.use(casas);

export default app;