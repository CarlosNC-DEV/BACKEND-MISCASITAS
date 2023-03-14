import { Router } from 'express';
import { verCasas ,crearCasa, desactivarCasa, activarCasa } from '../controllers/casas.controllers.js';
import multer from 'multer';
import { storage } from '../middleware/clodinary.js';
const upload = multer({
    storage: storage
})

const router = Router();

router.get("/casas", verCasas);
router.get("/casas", verCasas);

const input = upload.fields([{name: 'fotoAlquiler'}]);
router.post("/casas", input, crearCasa);

router.put("/casas/desactivar/:id", desactivarCasa);
router.put("/casas/activar/:id", activarCasa);
export default router;