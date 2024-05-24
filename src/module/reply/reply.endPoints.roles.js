// files imports
import { systemRoles } from "../../utils/systemRoles.js";

// object to specify who can make a reply
export const endPointsRoles = {
    reply :[systemRoles.ADMIN, systemRoles.USER]
}