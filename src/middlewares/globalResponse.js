
// function to return any response came from the async handler
export const globalResponses = (err,req,res,next)=>{
    if(err){
        return res.status(err['cause']||500).json({
            errMsg:err.message
        })
    }
}