// files imports
import { systemRoles } from "../../utils/systemRoles.js";

export const endPointsRoles = {
    GET_ALL_PRODUCTS :[systemRoles.ADMIN, systemRoles.USER],
    ADD_PRODUCTS :[systemRoles.ADMIN, systemRoles.USER],    
    Delete_PRODUCTS :[systemRoles.ADMIN, systemRoles.USER]
}