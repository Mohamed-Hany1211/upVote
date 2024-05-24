import mongoose from "mongoose";

const db_connction = async ()=>{
    await mongoose.connect(process.env.CONNECTION_URL_LOCAL).then(()=>{console.log('db connected successfully');}).catch((error)=>{console.log('db connection fail',error);})
}

export default  db_connction;