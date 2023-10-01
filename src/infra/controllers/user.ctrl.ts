import "dotenv/config"
import { NextFunction, Request, Response } from "express";
import Bridge from "../../application/bridge.api";
import { idQuery } from "../../types/request/queries";

export default class UserCtrl {
    private bridge;

    constructor() {
        this.bridge = new Bridge();
    }

    /**
     * signin
     */
    public signin = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.bridge.handleGoogleLogin(body)

            if (result?.error) {
                return res.status(400).json(result)
            } else {
                return res.json(result)
            }
        } catch (error) {
            next(error)
        }
    }

    /**
     * 
     */
    public autoLogin = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            console.log(body);

            res.sendStatus(200)

        } catch (error) {
            next(error)
        }
    }

    /**
     * TODO login
     */
    public login = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            console.log(body)
            res.sendStatus(200)

        } catch (error) {
            next(error)
        }
    }

    public getUserData = async (req: Request<{}, {}, {}, idQuery>, res: Response, next: NextFunction) => {
        try {
            const { id } = req.query
            const data = await this.bridge.getUser(id)

            if (data) return res.status(data.error ? 400 : 200).json(data)
            return res.status(500)

        } catch (error) {
            next(error)
        }
    }
}