import express from 'express';
import { connectDB } from './config/db.js';
import { ENV_VARS } from './config/envVars.js';
import cors from 'cors';
import { userRouter } from './routes/userRouter.js';
import { taskRouter } from './routes/taskRouter.js';

const PORT = ENV_VARS.PORT || process.env.PORT || 8081;  

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);

app.listen(PORT, (err) => {
    if (err) {
        console.log(err, "server is not started");
    } else {
        console.log(`listening on port: http://localhost:${PORT}`);
        connectDB();
    }
});
