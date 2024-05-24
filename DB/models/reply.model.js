import { Schema, model } from "mongoose";

const replySchema = new Schema({
    content:{type:String,required:true},
    addedBy:{type:Schema.Types.ObjectId,ref:'User'},
    replyOnId:{type:Schema.Types.ObjectId,refPath:'onModel'},
    onModel:{type:String,enum:['Comment','Reply']}, // This
    numberOfLikes:{type:Number,min:0,default:0}  //reference
},{timestamps:true})

export default model('Reply',replySchema);