// modules imports
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// files imports
import User from "../../../DB/models/user.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";


//============================ sign up ========================//
/* 
    // 1 - destructing the required data 
    // 2 - check if the email is already exist in the data base
    // 3 - hash the user password
    // 4 - upload user's image
    // 5 - create the img object 
    // 6 - create user's document in the data base
    // 7 - check if user documnet is created
    // 8 - return the response 
*/
export const signUp = async(req,res,next) => {
    // 1 - destructing the required data 
    const {userName,email,password,age,gender} = req.body;
    // 2 - check if the email is already exist in the data base
    const isEmailExist = await User.findOne( { email } );
    if(isEmailExist){
        return next(new Error('user is already exist , please signIn',{cause:409}));
    }
    // 3 - hash the user password
    const hashedPass = bcrypt.hashSync(password,+process.env.SALT_ROUNDS);
    // 4 - upload user's image
    const {secure_url,public_id} = await cloudinaryConnection().uploader.upload(req.file.path,{
        folder:'upVoteImgs/users'
    });
    // 5 - create the img object 
    const Img = {
        secure_url,
        public_id
    }
    // 6 - create user's document in the data base
    const newUser = await User.create( { userName , email , password:hashedPass , age , gender,Img});
    // 7 - check if user documnet is created
    if(!newUser){
        return next(new Error('account creation fail',{cause:400})) ;
    }
    // 8 - return the response 
    res.status(201).json({message:'account creation success',newUser});
}

// =================== signIn ================================// 

/*
    // 1 - destructing the required data 
    // 2 - check if the user exist in DB
    // 3 - compare the given password with the password in DB
    // 4 - generate the token
    // 5 - return the response
*/
export const signIn = async(req,res,next) =>{
    // 1 - destructing the required data 
    const {email,password}=req.body;
    // 2 - check if the user exist in DB
    const isEmailExist = await User.findOne( { email } );
    if(!isEmailExist){
        return next(new Error('user not found , please signUp',{cause:404}));
    }
    // 3 - compare the given password with the password in DB
    const isPasswordValid = bcrypt.compareSync(password,isEmailExist.password);
    if(!isPasswordValid){
        return next(new Error('Incorrect password',{cause:401}));
    }
    // 4 - generate the token
    const token = jwt.sign({email:isEmailExist.email,id:isEmailExist._id},process.env.TOKEN_SIGNATURE,{expiresIn:'1h'});
    // 5 - return the response
    return res.json({
        Msg:'user loggedIn successfully',
        token
    })
}
