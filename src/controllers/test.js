import * as dotenv from 'dotenv'
dotenv.config()

// import MODELO from "./model.js";
import { WebClient } from '@slack/web-api';

const { SLACK_TOKEN } = process.env;
const GENERAL_ID = 'C05RAAHM077';

//TODO es el lugar correcto para instanciar el cliente de slack?
const client = new WebClient(SLACK_TOKEN);

export const test = async (req, res, next) => {
    try {

        const result = await client.chat.postMessage({
            text: 'Hello world! :smiley:',
            channel: GENERAL_ID,
        });

        const message = `Successfully send message ${result.ts} in channel ID: ${GENERAL_ID}`

        console.log(message);

        res.json({ message })

    } catch (err) {
        next(err)
    }
}

export const send = async (req, res, next) => {
    try {
        if (!req?.body?.message) {
            res.status(403).json({ error: 'message necesario' })
        }

        const result = await client.chat.postMessage({
            text: req.body.message,
            channel: GENERAL_ID,
        });

        const message = `Successfully send message: "${req.body.message}" (${result.ts}) in channel ID: ${GENERAL_ID}`

        console.log(message);

        res.json({ message })

    } catch (err) {
        next(err)
    }
}

// client.on('message', (data) => {
//     console.log(data);
// })