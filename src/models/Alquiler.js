import { Schema, model } from 'mongoose';
const ObjectId = Schema.ObjectId;

const alquilerSchema = new Schema(
    {
        idTenedorAlquiler:{
            type: ObjectId
        },
        ValorRetenido:{
            type: Number
        },
        zona:{
            type: String
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model("Alquiler", alquilerSchema);