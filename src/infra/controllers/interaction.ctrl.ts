import { NextFunction, Request, Response } from "express";

import newActivity from "../../user-interface/modals/new-activity";

export default class InteractionCtrl {
    // constructor(private readonly ???: ???) { } // agregar repositorios necesarios

    public interactionHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req);

            // if (!req?.body?.callback_id) {
            //     return res.sendStatus(400)
            // }

            // const { callback_id } = body;
            // new_activity

            // if (callback_id === 'new_activity') {
            //     // newActivity()
            // }

            res.sendStatus(200);

        } catch (err) {
            next(err)
        }
    }
} 