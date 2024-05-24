// product imports
import Joi from "joi";
// files imports
import { generalRules } from "../../utils/general.validation.rules.js";

// validation Schema 
export const likeProductSchema = {
    body:Joi.object({
        onModel:Joi.string().required()
    }),
    params:Joi.object({
        productId:generalRules.dbId.required()
    }),
    headers:generalRules.headersRules
}