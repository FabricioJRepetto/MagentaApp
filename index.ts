import "dotenv/config"
import express from "express"
import cors from "cors"
import morgan from "morgan";
import routes from "./src/infra/routes/index"
import { error404, generalErrorHandler } from "./src/infra/middlewares";

import newActivity from "./src/user-interface/modals/new-activity";

const {
    PORT = 3000,
    SLACK_SIGNING_SECRET,
    SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET
} = process.env

const app = express()

// bolt.command("/registrar", async ({ ack, payload, client }) => {
//     try {
//         await ack();
//         const result = await client.views.open({
//             trigger_id: payload.trigger_id,
//             view: JSON.parse(newActivity(payload.user.id))
//         })
//         console.log(result);


//     } catch (error) {
//         console.error(error);
//     }
// })

app.use(cors())
app.use(express.json())
app.use(morgan("dev"));
app.use(`/`, routes)

app.use('*', error404)
app.use(generalErrorHandler);

app.listen(PORT, () => console.log(`\x1b[32m✔ \x1b[0m · Server listening on port ${PORT}`));