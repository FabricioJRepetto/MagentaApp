import { NextFunction, Request, Response } from "express";

import newActivity from "../../user-interface/modals/new-activity";

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
                // newActivity()
            }

            res.json({});

        } catch (err) {
            next(err)
        }
    }
} 