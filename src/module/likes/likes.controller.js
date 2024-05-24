// files imports
import Comment from "../../../DB/models/comment.model.js";
import likesModel from "../../../DB/models/likes.model.js";
import Product from "../../../DB/models/product.model.js";
import Reply from '../../../DB/models/reply.model.js';

// =========================== get user likes history ======================= //
/*
    // 1 - destructing the required data
    // 2 - get all likes for the user who already loggedIn
    // 3 - check if there is any likes
    // 4 - return the response
*/
export const getUserLikes = async (req,res,next) => {
    // 1 - destructing the required data
    const {_id} = req.authUser;
    // 2 - get all likes for the user who already loggedIn
    const likes = await likesModel.find({likedBy:_id,onModel:req.query.onModel}).populate([
        {
            path:'likeDoneOnId',
            populate:{
                path:'addedBy'
            }
        }
    ]);
    // 3 - check if there is any likes
    if(!likes.length){
        return next(new Error(`no likes found `,{cause:404}));
    }
    // 4 - return the response
    res.status(200).json({
        Msg:'done',
        likes
    });
}

// ====================== general like or unlike function ================= //
/*
    // 1 - destructing the required data 
    // 2 - create a variable to check which model the user want to like or unlike on 
    // 3 - check which model the user want to like or unlike on
    // 4 - find the requird document that the user want to like or unlike
    // 5 - check if the document is not found
    // 6 - check if the user already liked the document then ulike it and vice versa
    // 7 - if the user didn't like the document before then he can like it
    // 8 - return the response
*/
export const likeOrUnlike = async (req,res,next)=>{
    // 1 - destructing the required data 
    const {likeDoneOnId} = req.params;
    const {_id} = req.authUser;
    const {onModel} = req.body;
    // 2 - create a variable to check which model the user want to like or unlike on 
    let dbModel = '';
    // 3 - check which model the user want to like or unlike on
    if(onModel === 'Product') dbModel = Product;
    else if(onModel === 'Reply') dbModel = Reply;
    else if(onModel === 'Comment') dbModel = Comment;
    // 4 - find the requird document that the user want to like or unlike
    const document = await dbModel.findById(likeDoneOnId);
    // 5 - check if the document is not found
    if(!document){
        return next(new Error(`${onModel} not found`,{cause:404}));
    }
    // 6 - check if the user already liked the document then ulike it and vice versa
    const isAlreadyLiked = await likesModel.findOne({likedBy:_id,likeDoneOnId});
    if(isAlreadyLiked){
        await likesModel.findByIdAndDelete(isAlreadyLiked._id);
        document.numberOfLikes--;
        await document.save();
        return res.status(200).json({Msg:'Unliked successfully',document,count:document.numOfLikes});
    }
    // 7 - if the user didn't like the document before then he can like it
    const like = await likesModel.create({likedBy:_id,onModel,likeDoneOnId});
    document.numberOfLikes++;
    await document.save();
    // 8 - return the response
    res.status(201).json({Msg:'like done successfully',data:document})
}