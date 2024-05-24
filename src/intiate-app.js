import * as routers from './index.routes.js';
import db_connction from "../DB/connection.js";
import { globalResponses } from "../src/middlewares/globalResponse.js";

export const intiateApp = (app,express) => {
    const port = process.env.PORT;
app.use(express.json()); // Middleware for parsing JSON bodies
app.use('/uploads',express.static('uploads'))
app.use('/user',routers.userRouter);
app.use('/reply',routers.replyRouter);
app.use('/likes',routers.likesRouter);
app.use('/products',routers.productRouter);
app.use('/comments',routers.commentRouter);
app.use(globalResponses);

db_connction()
app.listen(port,()=>{console.log(`Server is running on ${port}`)});
}