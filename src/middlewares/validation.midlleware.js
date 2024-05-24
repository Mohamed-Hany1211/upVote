
// middleware to validate the data came from 'body','params','headers','query'
const reqKeys = ['body','params','headers','query'];

export const validationMiddleware = (schema)=>{
    return (req,res,next)=>{
        let validationErrorsArr = [];
        for(const key of reqKeys){
            const validationResult = schema[key]?.validate(req[key],{abortEarly:false});
            if(validationResult?.error){
                validationErrorsArr.push(...validationResult.error.details)
            }
        }


        if(validationErrorsArr.length){
            return res.json({
                errors:validationErrorsArr.map(ele => ele.message)
            })
        }
        next();
    }
}  
