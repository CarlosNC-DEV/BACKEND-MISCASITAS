import { Schema, model } from 'mongoose';

const adminiSchema = new Schema(
    {
        usuario:{
            type: String
        },
        correo:{
            type: String
        },
        contrasena:{
            type: String
        },
        monto:{
            type:Number,
            default: 0
        }
    },
    {
        versionKey: false
    }
)

export default model("Administradores", adminiSchema);