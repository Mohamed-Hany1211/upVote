// modules imports
import axios from "axios";
// files imports
import Comment from "../../../DB/models/comment.model.js";
import likesModel from "../../../DB/models/likes.model.js";
import Product from "../../../DB/models/product.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import generateUniqueString from "../../utils/generateUniqueString.js";

// ============================= add product ==================//

/*
    // 1 - destructing the required data
    // 2 - check if any file uploaded
    // 3 - array to store imgs info
    // 4 - array to store imgs publicIds
    // 5 - folder id created by generating unique string
    // 6 - loop through the files and upload them to cloudinary
        // 6.1 - push the imgs info to the imgs array
        // 6.2 - push the imgs publicIds to the publicIds array
    // 7 - create product document
    // 8 - check if product document created successfully
    // 9 - return the response

*/
export const addProduct = async (req,res,next) => {
    // 1 - destructing the required data
    const {title,caption} = req.body;
    const {_id} = req.authUser;
    // 2 - check if any file uploaded
    if(!req.files?.length){
        return next(new Error('please upload atleast one file',{cause:400}));
    }
    // 3 - array to store imgs info
    const imgs = [];
    // 4 - array to store imgs publicIds
    const publicIds = [];
    // 5 - folder id created by generating unique string
    const folderId = generateUniqueString(5);
    // 6 - loop through the files and upload them to cloudinary
    for(const file of req.files){
        const {secure_url , public_id } = await cloudinaryConnection().uploader.upload(file.path,{
            folder:`upVoteImgs/products/${_id}/${folderId}`
        })
        // 6.1 - push the imgs info to the imgs array
        imgs.push({secure_url , public_id ,folderId});
        // 6.2 - push the imgs publicIds to the publicIds array
        publicIds.push(public_id);
    }
    // 7 - create product document
    const createproduct = await Product.create({title,caption,imgs,addedBy:_id});
    // 8 - check if product document created successfully
    if(!createproduct){
        const deletedData = await cloudinaryConnection().api.delete_resources(publicIds);
        return next(new Error('error while creating  the product',{cause:500}))
    }
    // 9 - return the response
    return res.status(201).json({
        Msg:'product added successfully',
        data:createproduct
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
export const likeOrUnlikeProduct = async (req,res,next)=>{
    // 1 - destructing the required data
    const {productId} = req.params;
    const {onModel} = req.body;
    const {accesstoken} = req.headers;
    // 2 - using axios to access the like or unlike api insted of writing the same logic
    axios({
        // 2.1 - the method for using the api 
        method:'POST',
        url:`http://localhost:3000/likes/likeOrUnlike/${productId}`, // 2.2 - the url of like or unlike api
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
            response:'catch error'
        })
    });
}

// ====================== get all likes for product ==============//
/*
    // 1 - destructing the required data
    // 2 - find all likes for the product
    // 3 - check if any likes found
    // 4 - return the response
*/
export const getAllLikesForProduct = async (req,res,next)=>{
    // 1 - destructing the required data
    const {productId} = req.params;
    // 2 - find all likes for the product
    const allLikes = await likesModel.find({likeDoneOnId:productId}).populate([{
        path:'likeDoneOnId'
    }]);
    // 3 - check if any likes found
    if(!allLikes.length){
        return next(new Error('No Likes Found on this product',{cause:404}));
    }
    // 4 - return the response
    return res.status(200).json({
        Msg:'done',
        data:allLikes
    })
}

// ======================== update product ================= //
/*
    // 1 - destructing the required data
    // 2 - check if the product exist in DB
    // 3 - check if the user want to update the title
    // 4 - check if the user want to update the caption
    // 5 - check if the user want to update the img
        // 5.1 - check if there is no files uploaded
        // 5.2 - delete the old img
        // 5.3 - upload new img
        // 5.4 - looping on imgs array and update each img
    // 6 - save the product
    // 7 - return the response
*/
export const  updateProduct = async (req,res,next) =>{
    // 1 - destructing the required data
    const {title , caption , oldPublicId } = req.body;
    const {_id}= req.authUser;
    const {productId} = req.params;
    // 2 - check if the product exist in DB
    const product = await Product.findOne({_id:productId,addedBy: _id});
    if (!product) {
        return next( new Error("product not found",{cause:404} ) );
    }
    // 3 - check if the user want to update the title
    if(title){
        product.title=title;
    }
    // 4 - check if the user want to update the caption
    if(caption){
        product.caption=caption;
    }
    // 5 - check if the user want to update the img
    if(oldPublicId){
        // 5.1 - check if there is no files uploaded
        if(!req.file){
            return next(new Error("Image is required to be uploaded",{cause:400}))
        }
        // 5.2 - delete the old img
        await cloudinaryConnection().uploader.destroy(oldPublicId);
        // 5.3 - upload new img
        const {secure_url,public_id} = await cloudinaryConnection( ).uploader.upload(req.file.path,{
            folder:`upVoteImgs/products/${_id}/${product.imgs[0].folderId}`
        });
        // 5.4 - looping on imgs array and update each img
        product.imgs.map((img)=>{
            if(img.public_id===oldPublicId){
                img.public_id = public_id;
                img.secure_url=secure_url;
            }
        })
    }
    // 6 - save the product
    await product.save();
    // 7 - return the response
    return res.status(200).json({
        Msg:'update done successfully',
        product
    })
}

// ========================= delete product =============== //
/*
    // 1 - destructing the required data
    // 2 - check if the product exist in DB
    // 3 - array to save imgs publicIds
    // 4 - looping on imgs array and push the publicIds to the public_ids array
    // 5 - delete the imgs with folder from cloudinary
    // 6 - return the response
*/
export const deleteProduct = async (req,res,next)=>{
    // 1 - destructing the required data
    const {_id}= req.authUser;
    const {productId} = req.params;
    // 2 - check if the product exist in DB
    const product = await Product.findOneAndDelete({_id:productId,addedBy:_id});
    if(!product) return next(new Error('product not found ',{cause:404}));
    // 3 - array to save imgs publicIds
    const public_ids = [];
    // 4 - looping on imgs array and push the publicIds to the public_ids array
    for(const img of product.imgs){
        public_ids.push(img.public_id);
    }
    // 5 - delete the imgs with folder from cloudinary
    await cloudinaryConnection().api.delete_resources(public_ids);
    await cloudinaryConnection().api.delete_folder(`upVoteImgs/products/${_id}/${product.imgs[0].folderId}`);
    // 6 - return the response
    return res.status(200).json({
        Msg:'product deleted successfully'
    })
}

// ============================ get all products sorted ================= //
/* 
    // 1 - get all products
    // 2 - check if products found
    // 3 - loop on products and update their comments
    // 4 - return the response
*/
export const getAllProducts = async (req,res,next)=>{
    // 1 - get all products
    const products = await Product.find().lean();
    // 2 - check if products found
    if(!products.length) return next(new Error('No Products Found',{cause:404}));
    // 3 - loop on products and update their comments
    for(const product of products){
        const comment = await Comment.find({productId: product._id});
        product.comments = comment;
    }
    // 4 - return the response
    return res.status(200).json({
        Msg:'done',
        data:products
    })
}