import "dotenv/config"
import { NextFunction, Request, Response } from "express";
import Bridge from "../../application/bridge.api";
import jwt from "jsonwebtoken";
import { DecodedGoogleCredentials } from "../../types/request/decodedGoogleCredentials.interface";

export default class UserCtrl {
    private bridge;

    constructor() {
        this.bridge = new Bridge();
    }

    /**
     * login/signin
     */
    public login = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            

            res.sendStatus(200)
            
        } catch (error) {
            next(error)
        }
    }

    /**
     * signin
     */
    public signin = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            console.log(body);

            res.sendStatus(200)
            
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
}