import { Schema, model } from 'mongoose';

const usuariosSchema = new Schema(
    {
        fotoPerfil:{
            idFoto:{
                type: String
            },
            urlFotoPerfil:{
                type: String
            }
        },
        nombreCompleto:{
            type: String
        },
        fechaNacimiento:{
            type: Date
        },
        numeroIdentificacion:{
            type: Number
        },
        usuario: {
            type: String
        },
        contrasena: {
            type: String
        },
        montoDinero: {
            type: Number,
            default: 2000000
        }
    },
    {
        versionKey: false
    }
)

export default model("Usuarios", usuariosSchema)