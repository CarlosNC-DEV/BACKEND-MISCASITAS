import Casas from '../models/Casas.js';
import cloudinary from 'cloudinary';

export const verCasas = async(req, res)=>{
    try {
        const casas = await Casas.find().lean();
        if(!casas){
            return res.status(400).json("No Existen Alquileres")
        }
        res.status(200).json(casas);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export const crearCasa = async(req, res)=>{
    try {
        const { zona, direccion, costoAlquiler, ancho, largo, numPisos, capacidadPersona, categoria, descripcion } = req.body;
        if(!zona || !direccion || !costoAlquiler || !ancho || !largo || !numPisos || !capacidadPersona || !categoria || !descripcion){
            return res.status(400).json("Todos los datos son requeridos");
        }

        let idImgAlquiler;
        let urlImgAlquiler;

        if(req.files.fotoAlquiler){
            const result = await cloudinary.uploader.upload(req.files.fotoAlquiler[0].path);
            idImgAlquiler = result.public_id;
            urlImgAlquiler = result.secure_url;
        }else{
            return res.status(400).json("Se requiere imagen de foto de perfil");
        }

        const casaModel = new Casas(req.body);
        casaModel.medidas.ancho = ancho;
        casaModel.medidas.largo = largo;
        casaModel.imgCasa.idImg = idImgAlquiler;
        casaModel.imgCasa.urlImg = urlImgAlquiler;

        await casaModel.save();
        
        res.status(200).json("Nuevo alquiler creado correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export const desactivarCasa = async(req, res)=>{
    try {
        const { id } = req.params;
        const dasactivar = [{
            estado:{
                disponible: false,
                alquilado: false,
                desactivado: true
            }
        }]

        await Casas.findByIdAndUpdate(id, dasactivar[0]);
        res.status(200).json("Alquiler Desactivado Correctamente");

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export const activarCasa = async(req, res)=>{
    try {
        const { id } = req.params;
        const activar = [{
            estado:{
                disponible: true,
                alquilado: false,
                desactivado: false
            }
        }]

        await Casas.findByIdAndUpdate(id, activar[0]);
        res.status(200).json("Alquiler Activado Correctamente");

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
  