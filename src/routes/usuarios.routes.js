import { Router } from 'express';
import { crearUsuario, auchUsuarios, validarSesion, actualizarUsuario, verCasas, alquilarCasas, filtrarPorZona } from '../controllers/usuario.controlers.js';
import { veryToken } from '../middleware/jsonwebtoken.js';
import multer from 'multer';
import { storage } from '../middleware/clodinary.js';
const upload = multer({
    storage: storage
})

const router = Router();

const input = upload.fields([{name: 'fotoPerfil'}]);
router.post("/usuarios", input, crearUsuario)
router.post("/auch/usuarios", auchUsuarios)
router.get("/usuarios", veryToken, validarSesion);

const inputAc = upload.fields([{name: 'fotoPerfilAc'}]);
router.put("/usuarios/:id", inputAc, actualizarUsuario);

router.get("/casasDisponibles", verCasas);
router.post("/casasDisponibles", alquilarCasas);
router.get("/casasDisponibles/:zona", filtrarPorZona);

export default router;