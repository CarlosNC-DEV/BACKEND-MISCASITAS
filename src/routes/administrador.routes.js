import { Router } from 'express';
import { registrarAdministrador, auchAdministrador, validarSesion, verCasasEstado } from '../controllers/administrador.controllers.js';
import { veryToken } from '../middleware/jsonwebtoken.js';

const router = Router();

router.post("/administrador", registrarAdministrador);
router.post("/auch/administrador", auchAdministrador);
router.get("/administrador", veryToken, validarSesion);

router.get("/casas/:estado", verCasasEstado);

export default router;
