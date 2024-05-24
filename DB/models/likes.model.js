
import { Schema, model } from "mongoose";


const likeSchema = new Schema({
    likedBy:{type:Schema.Types.ObjectId,ref:'User'},
    likeDoneOnId:{type:Schema.Types.ObjectId,refPath:'onModel'},
    onModel:{
        type:String,  //Post or Comment
        enum:['Product','User','Comment','Reply']
    }
},{timestamps:true});

export default model('likes',likeSchema);