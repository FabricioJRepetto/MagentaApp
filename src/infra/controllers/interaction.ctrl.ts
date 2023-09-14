import { NextFunction, Request, Response } from "express";
import { ExternalCreator } from "../../application/controller.create";
import QueryString from "qs";
import axios from "axios";

import newActivity from "../../user-interface/modals/new-activity";

export default class InteractionCtrl {
    // constructor(private readonly ???: ???) { } // agregar repositorios necesarios
    constructor(private readonly external: ExternalCreator) { }

    public interactionHandler = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            console.log(body);

            switch (body.type) {
                case 'url_verification': {
                    // verify Events API endpoint by returning challenge if present
                    res.send({ challenge: body.challenge });
                    break;
                }
                case 'shortcut': {
                    console.log(body.event);

                    // Verify the signing secret
                    // if (!signature.isVerified(req)) {
                    //     res.sendStatus(404);
                    //     return;
                    // }
                    // Request is verified --
                    const { type, user, channel, tab, text, subtype } = body.event;
                    console.log(type);

                    // Triggered when the App Home is opened by a user
                    if (type === 'app_home_opened') {
                        // Display App Home
                        openModal(user);
                    }
                }
            }

            res.sendStatus(200)

            // console.log(body);

            // if (!body?.trigger_id) {
            //     return res.sendStatus(400)
            // }

            // if (body.callback_id === 'new_activity') {
            //     this.external.openModal({ id: body.trigger_id, user: body.user.id })
            // }

            // res.sendStatus(200);

        } catch (err) {
            next(err)
        }
    }
}

const openModal = async (user: string) => {
    const args = {
        token: process.env.SLACK_BOT_TOKEN,
        user_id: user,
        view: await newActivity(user)
    };
    const result = await axios.post('https://slack.com/api/views.open', QueryString.stringify(args));
};


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