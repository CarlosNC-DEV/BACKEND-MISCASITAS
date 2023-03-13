import { Router } from 'express';
import { registrarAdministrador, auchAdministrador, validarSesion } from '../controllers/administrador.controllers.js';
import { veryToken } from '../middleware/jsonwebtoken.js';

const router = Router();

router.post("/administrador", registrarAdministrador);
router.post("/auch/administrador", auchAdministrador);
router.get("/administrador", veryToken, validarSesion);

export default router;
