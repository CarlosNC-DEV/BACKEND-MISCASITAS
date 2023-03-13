import Administrador from '../models/Administrador.js';
import Casas from '../models/Casas.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import bcryptjs from 'bcryptjs';

export const registrarAdministrador = async(req, res)=>{
    try {
        const { usuario, correo, contrasena } = req.body;

        if(!usuario || !correo || !contrasena){
            return res.status(400).json("Todos los datos son requeridos");
        }
        const administradorExistente = await Administrador.findOne({ usuario });

        if(administradorExistente){
            return res.status(400).json("Usuario administrador ya existente");
        }

        const hasheContrasena = await bcryptjs.hash(contrasena, 10);
        const administradorModel = new Administrador({ usuario: usuario, correo:correo, contrasena:hasheContrasena });
        await administradorModel.save();

        res.status(200).json("Administrador creado satisfactoriamente");

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export const auchAdministrador = async(req, res)=>{
    try {
        const { correo, contrasena } = req.body;
        if(!correo || !contrasena){
            return res.status(400).json("Todos los datos son requeridos");
        }

        const administrador = await Administrador.findOne({ correo });
        if(!administrador){
            return res.status(400).json("Correo incorrecto");
        }

        const validarContrasena = await bcryptjs.compare(contrasena, administrador.contrasena);
        if(!validarContrasena){
            return res.status(400).json("Contraseña incorrecto");
        }

        const token = jwt.sign({ adminId: administrador._id}, JWT_SECRET, { expiresIn: '24h' });
        
        res.status(200).json(token);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export const validarSesion = async(req, res)=>{
    try {
        const administrador = await Administrador.findById(req.adminId).lean();
        if(!administrador){
            return res.status(401).json("No autorizado");
        }

        res.json({_id: administrador._id, usuario: administrador.usuario, correo: administrador.correo, monto: administrador.monto });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export const verCasasEstado = async(req, res)=>{
    try {
        const { estado } = req.params;
        const casas = await Casas.find({ ["estado." + estado]: true }).lean();
        if(!casas){
            return res.status(400).json("No Existen Alquileres")
        }
        res.status(200).json(casas);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}