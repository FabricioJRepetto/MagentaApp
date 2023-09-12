import { NextFunction, Request, Response } from "express";

import { newActivityCallback } from "../listeners/shortcuts/newActivity.js";

export default class InteractionCtrl {
    // constructor(private readonly ???: ???) { } // agregar repositorios necesarios

    public interactionHandler = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            if (!body?.callback_id) {
                return res.sendStatus(400)
            }

            console.log(body);
            const { callback_id } = body;
            // new_activity

            if (callback_id === 'new_activity') {
                newActivityCallback()
            }

            res.json({});

        } catch (err) {
            next(err)
        }
    }
} 