import { Schema, model } from "mongoose";
import { systemRoles } from "../../src/utils/systemRoles.js";

const userSchema = new Schema({
    userName:{
        type: String, 
        required: true,
        min:3
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type: String, 
        required: true,
    },
    age: Number,
    gender:{
        type:String,
        enum:['male','female'],
        default: 'male'
    },
    role:{
        type:String,
        enum:[systemRoles.ADMIN,systemRoles.USER],
        default: systemRoles.USER
    },
    Img:{
        secure_url:{type:String, required: true},
        public_id:{type:String, required: true,unique:true}
    }
},{timestamps:true})


export default model('User',userSchema);