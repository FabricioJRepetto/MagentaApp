import "dotenv/config"
import express from "express"
import cors from "cors"
import morgan from "morgan";
import routes from "./src/infra/routes/index"
import { error404, generalErrorHandler } from "./src/infra/middlewares";

const { PORT = 3000 } = process.env

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(`/`, routes)

app.use('*', error404)
app.use(generalErrorHandler);

app.listen(PORT, () => console.log(`\x1b[32m✔ \x1b[0m · Server listening on port ${PORT}`));