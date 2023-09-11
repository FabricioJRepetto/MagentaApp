import * as dotenv from 'dotenv'
dotenv.config()
import express, { json, urlencoded } from "express";
import router from "./infra/routes/index.js";
import { allowCors, error404, generalErrorHandler } from './middlewares/index.js';
import cors from "cors";
import morgan from "morgan";

const { CLIENT_URL } = process.env;

const app = express();

app.use(allowCors())
app.use(cors({
    origin: {
        origin: ['http://localhost:3000', CLIENT_URL,]
    }
}));

app.use(json({ limit: "50mb" }));
app.use(urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));

app.use("/", router);
app.use('*', error404)
app.use(generalErrorHandler);

export default app