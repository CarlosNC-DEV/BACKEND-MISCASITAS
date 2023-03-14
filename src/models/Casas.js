import { Schema, model } from 'mongoose';
const ObjectId = Schema.ObjectId;

const casaSchema = new Schema(
    {
        imgCasa:{
            idImg:{
                type: String
            },
            urlImg:{
                type: String
            }
        },
        zona:{
            type: String
        },
        direccion: {
            type: String
        },
        costoAlquiler:{
            type: Number
        },
        medidas:{
            ancho:{
                type: Number
            },
            largo:{
                type: Number
            }
        },
        numPisos:{
            type:Number
        },
        capacidadPersona:{
            type: Number
        },
        categoria: {
            type: String
        },
        descripcion:{
            type: String
        },
        estado:{
            disponible:{
                type: Boolean,
                default: true
            },
            alquilado:{
                type: Boolean,
                default: false,
            },
            desactivado: {
                type: Boolean,
                default: false
            }
        },                
        idAlquiler:{
            type: ObjectId,
            default: null
        },
    },
    {
        versionKey: false
    }
)
export default model("Casas", casaSchema);