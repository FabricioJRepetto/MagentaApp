import "dotenv/config"
import express from "express"
import cors from "cors"
import morgan from "morgan";
import routes from "./src/infra/routes/index"
import { error404, generalErrorHandler } from "./src/infra/middlewares";

import { App, ExpressReceiver } from "@slack/bolt";
import { FileInstallationStore } from "@slack/oauth";
import InterCtrl from "./src/infra/controllers/interaction.ctrl";
import container from "./src/infra/ioc";
import newActivity from "./src/user-interface/modals/new-activity";

const {
    PORT = 3000,
    SLACK_SIGNING_SECRET,
    SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET
} = process.env

const expressApp = express()

const receiver = new ExpressReceiver({
    app: expressApp,
    clientId: SLACK_CLIENT_ID,
    clientSecret: SLACK_CLIENT_SECRET,
    signingSecret: SLACK_SIGNING_SECRET || "b9312e18af1746f7d1d2f85b44d5bbbd",
    stateSecret: 'my-state-secret',
    scopes: ['commands', 'chat:write', 'channels:read', 'app_mentions:read'],
    installationStore: new FileInstallationStore({})
});

// Initializes your app with your bot token and signing secret
const app = new App({
    receiver
});

// app.command("/standup", async ({ ack }) => {
//     await ack("Hi there!");
// })

app.command("Registrar", async ({ ack, payload, client }) => {
    try {
        await ack();
        const result = await client.views.open({
            trigger_id: payload.trigger_id,
            view: JSON.parse(newActivity(payload.user.id))
        })
        console.log(result);


    } catch (error) {
        console.error(error);
    }
})

expressApp.use(cors())
expressApp.use(express.json())
expressApp.use(morgan("dev"));
expressApp.use(`/`, routes)

expressApp.use('*', error404)
expressApp.use(generalErrorHandler);

expressApp.listen(PORT, () => {
    console.log(`⚡️ Bolt+Express app is running on port ${PORT}`);
});



//____________________\\

// app.use(cors())
// app.use(express.json())
// app.use(morgan("dev"));
// app.use(`/`, routes)

// app.use('*', error404)
// app.use(generalErrorHandler);

// app.listen(PORT, () => console.log(`\x1b[32m✔ \x1b[0m · Server listening on port ${PORT}`));