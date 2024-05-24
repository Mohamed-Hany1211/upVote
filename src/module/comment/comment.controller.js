// modules imports 
import axios from 'axios';
// files imports
import Comment from '../../../DB/models/comment.model.js';
import Product from '../../../DB/models/product.model.js';

// ========================= add comment ================= //
/*
    // 1 - destructing the required data 
    // 2 - find the product by id which the user want to make comment on 
    // 3 - check if the product exist
    // 4 - create a new comment
    // 5 - check if the comment created
    // 6 - return the response
*/
export const addComment = async (req,res,next) => {
    // 1 - destructing the required data 
    const {content} = req.body;
    const {_id} = req.authUser;
    const {productId} = req.params;
    // 2 - find the product by id which the user want to make comment on 
    const product = await Product.findById(productId);
    // 3 - check if the product exist
    if(!product) return next(new Error(`Couldn't find product`,{cause:404}));
    // 4 - create a new comment
    const comment = await Comment.create({content , addedBy:_id , productId});
    // 5 - check if the comment created
    if(!comment) return next(new Error(`Couldn't create comment`,{cause:500}));
    // 6 - return the response
    return res.status(201).json({
        Msg:'comment created successfully',
        comment
    })
}

// ============================ Like or unLike api ===============//
/*
    // 1 - destructing the required data
    // 2 - using axios to access the like or unlike api insted of writing the same logic
        // 2.1 - the method for using the api 
        // 2.2 - the url of like or unlike api
        // 2.3 - choosing which model that we want to apply the like or unlike at
        // 2.4 - thaking the token to make sure that the user signedIn
    // 3 - return the response in case of success
    // 4 - return the response in case of fail 
*/
export const likeOrUnlikeComment = async (req,res,next)=>{
    // 1 - destructing the required data
    const {commentId} = req.params;
    const {onModel} = req.body;
    const {accesstoken} = req.headers;
    // 2 - using axios to access the like or unlike api insted of writing the same logic
    axios({
        // 2.1 - the method for using the api
        method:'POST',
        url:`http://localhost:3000/likes/likeOrUnlike/${commentId}`, // 2.2 - the url of like or unlike api
        data:{
            onModel // 2.3 - choosing which model that we want to apply the like or unlike at
        },
        headers:{
            accesstoken // 2.4 - thaking the token to make sure that the user signedIn
        }
    }).then((response)=>{
        // 3 - return the response in case of success
        res.status(200).json({
            response:response.data
        })
    }).catch((err)=>{
        // 4 - return the response in case of fail 
        res.status(500).json({
            response:'catch error',
            err
        })
    });
}