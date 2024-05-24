// modules imports
import { customAlphabet } from "nanoid";

// function to generate unique Strings , Note : len refares to the length of the unique string
const generateUniqueString = (len)=>{
    const nanoid = customAlphabet('1234567890asdfghjkl',len||13);
    return nanoid()
}

export default generateUniqueString;