import * as dotenv from 'dotenv'
dotenv.config()

import { WebClient } from '@slack/web-api';
import { NextFunction, Response, Request } from 'express';

const { SLACK_TOKEN } = process.env;
const GENERAL_ID = 'C05RAAHM077';
const client = new WebClient(SLACK_TOKEN);

export const test = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await client.chat.postMessage({
            text: 'Hello world! :smiley:',
            channel: GENERAL_ID,
        });

        const message: string = `Successfully send message ${result.ts} in channel ID: ${GENERAL_ID}`

        console.log(message);

        res.json({ message });

    } catch (err) {
        next(err)
    }
}

export const send = async ({ body }: Request, res: Response, next: NextFunction) => {
    try {
        if (!body?.message) {
            return res.status(403).json({ error: 'message necesario' })
        }

        const result = await client.chat.postMessage({
            text: body.message,
            channel: GENERAL_ID,
        });

        const message = `Successfully send message: "${body.message}" (${result.ts}) in channel ID: ${GENERAL_ID}`

        console.log(message);

        res.json({ message })

    } catch (err) {
        next(err)
    }
}