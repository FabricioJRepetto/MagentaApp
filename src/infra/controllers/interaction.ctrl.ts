import { NextFunction, Request, Response } from "express";
import { ExternalCreator } from "../../application/controller.create";

import newActivity from "../../user-interface/modals/new-activity";

export default class InteractionCtrl {
    // constructor(private readonly ???: ???) { } // agregar repositorios necesarios
    constructor(private readonly external: ExternalCreator) { }

    public interactionHandler = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            console.log(body);

            if (!body?.trigger_id) {
                return res.sendStatus(400)
            }

            if (body.callback_id === 'new_activity') {
                this.external.openModal({ id: body.trigger_id, user: body.user.id })
            }

            res.sendStatus(200);

        } catch (err) {
            next(err)
        }
    }
}

/* Payload

    {
    "type": "shortcut",
    "token": "XXXXXXXXXXXXX",
    "action_ts": "1581106241.371594",
    "team": {
        "id": "TXXXXXXXX",
        "domain": "shortcuts-test"
    },
    "user": {
        "id": "UXXXXXXXXX",
        "username": "aman",
        "team_id": "TXXXXXXXX"
    },
    "callback_id": "shortcut_create_task",
    "trigger_id": "944799105734.773906753841.38b5894552bdd4a780554ee59d1f3638"
    } 
 */