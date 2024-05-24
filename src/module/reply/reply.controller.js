// files imports
import Comment from "../../../DB/models/comment.model.js";
import replyModel from "../../../DB/models/reply.model.js";

// ============================ add reply ===================//
/*
    // 1 - destructing the required data
    // 2 - check which model the user is reply on 
        // 2.1 - check if the comment that the user want to reply on is exist in DB
        // 2.2 - check if the reply that the user want to reply on is exist in DB
    // 3 - create the reply document  
    // 4 - check if the document is created
    // 5 - return the response
*/
export const addReply = async (req,res,next)=>{
    // 1 - destructing the required data
    const {content,onModel} = req.body;
    const {_id} = req.authUser;
    const {replyOnId} = req.params;
    // 2 - check which model the user is reply on 
    if(onModel == 'Comment'){
        // 2.1 - check if the comment that the user want to reply on is exist in DB
        const comment = await Comment.findById(replyOnId);
        if(!comment){
            return next(new Error("the comment not found",{cause:404}));
        }
    }else if(onModel == 'Reply'){
        // 2.2 - check if the reply that the user want to reply on is exist in DB
        const reply = await replyModel.findById(replyOnId);
        if(!reply){
            return next(new Error("the reply not found",{cause:404}));
        }
    }
    // 3 - create the reply document  
    const reply = await replyModel.create({content,addedBy:_id,onModel,replyOnId});
    // 4 - check if the document is created
    if(!reply){
        return next(new Error("couldn't create reply",{cause:500}));
    }
    // 5 - return the response
    res.status(201).json({
        Msg:'reply created successfully',
        reply
    })
}