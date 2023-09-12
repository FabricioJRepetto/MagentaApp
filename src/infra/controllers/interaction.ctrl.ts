import { NextFunction, Request, Response } from "express";

export default class InteractionCtrl {
    // constructor(private readonly ???: ???) { } // agregar repositorios necesarios

    public interactionHandler = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            // new_activity
            console.log(body);

            res.json({});

        } catch (err) {
            next(err)
        }
    }
} 