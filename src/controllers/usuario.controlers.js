import Usuarios from '../models/Usuarios.js';
import Casas from '../models/Casas.js';
import Alquiler from '../models/Alquiler.js';
import Administrador from '../models/Administrador.js';
import bcryptjs from 'bcryptjs';
import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const crearUsuario = async(req, res)=>{
    try {

        const { nombreCompleto, fechaNacimiento, numeroIdentificacion, usuario, contrasena } = req.body;
        if( !nombreCompleto || !fechaNacimiento || !numeroIdentificacion || !usuario || !contrasena){
            return res.status(400).json("Todos los datos son requeridos");
        }

        const usuarioExistente = await Usuarios.findOne({usuario});
        if(usuarioExistente){
            return res.status(400).json("Usuario ya existente");
        }

        let idImgUsuario;
        let urlImgUsuario;

        if(req.files.fotoPerfil){
            const result = await cloudinary.uploader.upload(req.files.fotoPerfil[0].path);
            idImgUsuario = result.public_id;
            urlImgUsuario = result.secure_url;
        }else{
            return res.status(400).json("Se requiere imagen de foto de perfil");
        }

        const hashedContrasena = await bcryptjs.hash(contrasena, 10);
        const usuarioModel = new Usuarios(req.body);
        usuarioModel.contrasena = hashedContrasena;
        usuarioModel.fotoPerfil.idFoto = idImgUsuario;
        usuarioModel.fotoPerfil.urlFotoPerfil = urlImgUsuario;

        await usuarioModel.save();
        res.status(200).json("Usuario creado satisfactoriamente");

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export const auchUsuarios = async(req, res)=>{
    try {
        const { usuario, contrasena } = req.body;
        if(!usuario || !contrasena){
            return res.status(400).json("Todos los campos son requeridos");
        }
        const usuarios = await Usuarios.findOne({usuario});
        if(!usuarios){
            return res.status(400).json("Usuario Inconrrecto");
        }
        const validarContrasena = await bcryptjs.compare(contrasena, usuarios.contrasena);
        if(!validarContrasena){
            return res.status(400).json("Contraseña Inconrrecto");
        }

        const token = jwt.sign({ userId: usuarios._id }, JWT_SECRET, { expiresIn: '24h' });
        res.json(token)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export const validarSesion = async(req, res)=>{
    try {
        const usuario = await Usuarios.findById(req.userId).lean();
        if(!usuario){
            return res.status(401).json("No autorizado");
        }

        res.status(200).json({
            _id: usuario._id,
            fotoPerfil: usuario.fotoPerfil.urlFotoPerfil,
            nombre: usuario.nombreCompleto,
            identificacion: usuario.numeroIdentificacion,
            usuario: usuario.usuario,
            correo: usuario.correo,
            dinero: usuario.montoDinero 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export const actualizarUsuario = async(req, res)=>{
    try {
        const { id } = req.params;
        const { usuario, nombreCompleto }= req.body;
        if(!usuario || !nombreCompleto ){
            return res.status(400).json("Todos los datos son requeridos");
        }

        let idImgUsuario;
        let urlImgUsuario;

        if(req.files.fotoPerfilAc){
            const result = await cloudinary.uploader.upload(req.files.fotoPerfilAc[0].path);
            idImgUsuario = result.public_id;
            urlImgUsuario = result.secure_url;
        }else{
            return res.status(400).json("Se requiere imagen de foto de perfil");
        }

        const updateData = {
            usuario: usuario,
            nombreCompleto: nombreCompleto,
            fotoPerfil: {
              idFoto: idImgUsuario,
              urlFotoPerfil: urlImgUsuario,
            },
          };

        await Usuarios.findByIdAndUpdate(id, updateData);

        res.status(200).json("Usuario Actualizado Correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export const verCasas = async(req, res)=>{
    try {
        const casasAct = await Casas.find({ 'estado.desactivado': false, 'estado.alquilado': false });
        if(!casasAct){
            return res.status(400).json("No existen alquileres");
        }
        res.status(200).json(casasAct);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export const alquilarCasas = async(req, res)=>{
    try {
        const { idTenedorAlquiler, ValorRetenido, idCasa, zona, nuevoMontoUsuario } = req.body;
        const alquilerModel = new Alquiler();
        alquilerModel.idTenedorAlquiler = idTenedorAlquiler;
        alquilerModel.ValorRetenido = ValorRetenido;
        alquilerModel.zona = zona;


        const alquilerSave =  await alquilerModel.save();
        await Casas.findByIdAndUpdate(idCasa, { 'estado.desactivado': false, 'estado.disponible': false, 'estado.alquilado': true, 'idAlquiler': alquilerSave._id});
        await Usuarios.findByIdAndUpdate(idTenedorAlquiler, {montoDinero:nuevoMontoUsuario});

        const administrador = await Administrador.findOne().lean();
        console.log(administrador);
        const montoActualAdministrador = administrador.monto;
        const nuevoMontoAdministrador = montoActualAdministrador + ValorRetenido;
        await Administrador.updateOne({}, { monto: nuevoMontoAdministrador });

        res.status(200).json("Felicidades alquiler confirmado");

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}