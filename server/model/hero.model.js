import mongoose from "mongoose";

const heroimageSchema = new mongoose.Schema({

    heroimage:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AllImage',
        required: true
    }]
});
export const HeroImage=mongoose.model('HeroImage',heroimageSchema);