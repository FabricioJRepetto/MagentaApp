import { ContainerBuilder } from "node-dependency-injection";
import { RequestCreator } from "../application/controller.create";
import TestCtrl from "./controllers/test.ctrl";
import SlackClient from "./repository/slackClient";

const container = new ContainerBuilder();

// Inicamos servicio de Slack Bot
container.register("slack.service", SlackClient);
const slackService = container.get("slack.service");

//TODO Añadir servicio DB y Google Calendar

container
    .register("request.creator", RequestCreator)
    .addArgument([slackService]);

const requestCreator = container.get("request.creator");

container.register("test.ctrl", TestCtrl).addArgument(requestCreator);

export default container;