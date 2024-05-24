// files imports
import { systemRoles } from "../../utils/systemRoles.js";

// object to specify who can make a like or unlike
export const endPointsRoles = {
    LIKE :[systemRoles.ADMIN, systemRoles.USER]
}