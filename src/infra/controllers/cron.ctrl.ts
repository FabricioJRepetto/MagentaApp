import "dotenv/config"
import { Request, Response } from "express";
import Bridge from "../../application/bridge";

export default class CronCtrl {
    private bridge;

    constructor() {
        this.bridge = new Bridge();
    }

    /**
     * Responde al evento enviado por el cron de Vercel 
     */
    public handler = async ({ body }: Request, res: Response) => {
        try {
            await this.bridge.notify()
            res.send()

        } catch (err) {
            console.log(err);
            res.status(400).send(err)
        }
    }
}