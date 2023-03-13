import { Router } from 'express';
import { verCasas ,crearCasa, desactivarCasa, activarCasa } from '../controllers/casas.controllers.js';

const router = Router();

router.get("/casas", verCasas);
router.get("/casas", verCasas);
router.post("/casas", crearCasa);
router.put("/casas/desactivar/:id", desactivarCasa);
router.put("/casas/activar/:id", activarCasa);
export default router;