// modules imports 
import jwt from 'jsonwebtoken';
// files imports
import User from '../../DB/models/user.model.js';

/*
            // 1 - destructing the user's token from the headers
            // 2 - check if the token has sent 
            // 3 - check if the token starts with token prefix specified
            // 4 - split the token from the prefix to decode & verify it
            // 5 - decode & verify Token
            // 6 - finding the user that signedIn 
            // 7 - authorization check
            // 8 - creating a key in the request object and assign the user's data in it
            // 9 - return the response in case of failer
*/
export const auth = (accessRoles) => {
    return async (req, res, next) => {
        try {
            // 1 - destructing the user's token from the headers
            const { accesstoken } = req.headers;
            // 2 - check if the token has sent 
            if (!accesstoken) {
                return next(new Error('please login first', { cause: 400 }));
            }
            // 3 - check if the token starts with token prefix specified
            if (!accesstoken.startsWith(process.env.TOKEN_PRIFEX)) {
                return next(new Error('invalid token prefix', { cause: 400 }));
            }
            // 4 - split the token from the prefix to decode & verify it
            const token = accesstoken.split(process.env.TOKEN_PRIFEX)[1];
            // 5 - decode & verify Token
            const decodedData = jwt.verify(token, process.env.TOKEN_SIGNATURE);
            if (!decodedData || !decodedData.id) {
                return next(new Error('invalid token payload', { cause: 400 }));
            }
            // 6 - finding the user that signedIn 
            const findUser = await User.findById(decodedData.id);
            if (!findUser) {
                return next(new Error('please signUp first', { cause: 404 }));
            }
            // 7 - authorization check
            if (!accessRoles.includes(findUser.role)) {
                return next(new Error('you are not allowed to access this route', { cause: 401 }));
            }
            // 8 - creating a key in the request object and assign the user's data in it
            req.authUser = findUser;
            next();

        } catch (err) {
            // 9 - return the response in case of failer
            return next(new Error('catch error in auth middleware', { cause: 500 }));
        }
    }
}