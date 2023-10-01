import { NextFunction, Request, Response } from "express";
import Bridge from "../../application/bridge.api";
import MongoDB from "../repository/mongo.repository";
import IdbRepository from "../../types/db.repository.interface";

// Controlador, solo recibe y responde
export default class TestCtrl {
    private bridge: Bridge;
    private db: IdbRepository;

    constructor() {
        this.bridge = new Bridge();
        this.db = new MongoDB();
    }

    public newUser = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, sub, picture } = body;
            const data = await this.db.createGoogleUser(body)
            // const data = await this.bridge.newGoogleUser(body)
            res.status(200).json(data)

        } catch (err) {
            next(err)
        }
    }

    public getUsers = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.bridge.getAllUsers();
            res.status(200).json(data)

        } catch (error) {
            next(error)
        }
    }
}


/*
{"_id":{"$oid":"651493b601266454e907f93f"},"name":"Fabricio Repetto","username":"fabricio.j.repetto","email":"fabricio.j.repetto@gmail.com","phone":"+541158722352","slack_id":"U05QYMSN93R","active":true,"role":"USER","createdAt":{"$date":{"$numberLong":"1695847350234"}},"updatedAt":{"$date":{"$numberLong":"1695847350332"}},"config":{"$oid":"651493b601266454e907f941"},"logs":{"$oid":"651493b601266454e907f944"}}
*/