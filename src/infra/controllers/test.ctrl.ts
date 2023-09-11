import { NextFunction, Request, Response } from "express";
import { RequestCreator } from "../../application/controller.create";

// Controlador, solo recibe y responde
export default class TestCtrl {
    constructor(private readonly requestCreator: RequestCreator) { }

    public test = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.requestCreator.sayHello();

            const message: string = `Successfully successfully greeted (ID ${response.ts}) on "General" channel`
            console.log(response, message);
            res.json({ response, message });

        } catch (err) {
            next(err)
        }
    }

    public send = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            if (!body?.message || !body?.channel) {
                return res.status(403).json({ error: 'message & channel id needed' })
            }

            const response = await this.requestCreator.sendMessage(body);

            const message = `Successfully sended message: "${body.message}" (ID ${response.ts}) on channel ID: ${body.channel}`

            console.log(message);
            res.json({ message })

        } catch (err) {
            next(err)
        }
    }

    public mention = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            //TODO implementar 
            const { challenge } = body;
            this.requestCreator.mention();
            res.sendStatus(200).json({ challenge })
        } catch (err) {
            next(err)
        }
    }
}