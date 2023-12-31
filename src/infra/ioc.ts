import { ContainerBuilder } from "node-dependency-injection";
import InteractionCtrl from "./controllers/interaction.ctrl";
import CronCtrl from "./controllers/cron.ctrl";
import TestCtrl from "./controllers/test.ctrl";
import UserCtrl from "./controllers/user.ctrl";

const container = new ContainerBuilder();

//? Inicamos servicio de Slack Bot
// container.register("slack.service", SlackClient);
// const slackService = container.get("slack.service");

//TODO Añadir servicio DB y Google Calendar

// container
//     .register("request.creator", ExternalCreator)
//     .addArgument([slackService]);

// const requestCreator = container.get("request.creator");

//? Test
container
    .register("test.ctrl", TestCtrl);

//? Controlador Interacciones de Slack
container
    .register("interaction.ctrl", InteractionCtrl)

//? Controlador Cron de Vercel
container
    .register("cron.ctrl", CronCtrl)

//? Controlador de Usuarios
container
    .register("user.ctrl", UserCtrl)

export default container;