import "dotenv/config"
import express from "express"
import cors from "cors"
import morgan from "morgan";
import routes from "./infra/routes/index"
import { error404, generalErrorHandler } from "./infra/middlewares";

const { PORT = 3000 } = process.env

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(`/`, routes)

app.use('*', error404)
app.use(generalErrorHandler);

export const startServer = () => {
    app.listen(PORT, () => console.log(`[✔] · Server listening on port ${PORT}`));
}

export const closeServer = () => {
    console.log("[!] · Closing server");
    process.exit()
}