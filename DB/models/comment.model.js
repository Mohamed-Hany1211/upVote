import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    content:{type: String,required:true},
    addedBy:{type:Schema.Types.ObjectId,ref:'User'},
    productId:{type:Schema.Types.ObjectId,ref:'Product'},
    numberOfLikes:{type:Number,min:0,default:0}  //reference
},{timestamps:true});

export default model('Comment',commentSchema);

