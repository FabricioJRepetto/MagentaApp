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
            const response = await this.bridge.notify()
            res.status(200).json(response)

        } catch (err) {
            console.log(err);
            res.status(400).send(err)
        }
    }
}