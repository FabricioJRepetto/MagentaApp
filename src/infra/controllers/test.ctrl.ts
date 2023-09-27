import { NextFunction, Request, Response } from "express";
import Bridge from "../../application/bridge";

// Controlador, solo recibe y responde
export default class TestCtrl {
    private bridge: Bridge;

    constructor() {
        this.bridge = new Bridge();
    }

    public test = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.bridge.newGoogleUser(body)
            res.status(200).json(response)

        } catch (err) {
            next(err)
        }
    }
}