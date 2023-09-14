import { NextFunction, Request, Response } from "express";
// import { ExternalCreator } from "../../application/controller.create";
import QueryString from "qs";
import axios from "axios";

import newActivity from "../../user-interface/modals/new-activity";

export default class InteractionCtrl {
    // constructor(private readonly ???: ???) { } // agregar repositorios necesarios
    // constructor(private readonly external: ExternalCreator) { }

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
                    const { type, user, callback_id, trigger_id } = body;
                    // Verify the signing secret
                    // if (!signature.isVerified(req)) {
                    //     res.sendStatus(404);
                    //     return;
                    // }

                    // Request is verified --
                    console.log(type);

                    if (callback_id === "new_activity") {
                        res.sendStatus(200)
                        openModal(trigger_id, user.id)
                    }

                    // Triggered when the App Home is opened by a user
                    if (type === 'app_home_opened') {
                        // Display App Home
                        // res.sendStatus(200)
                    }

                }
            }

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

const openModal = async (trigger_id: string, user: string) => {
    const args = {
        token: process.env.SLACK_BOT_TOKEN,
        trigger_id: trigger_id,
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

    {
  payload: '{"type":"shortcut","token":"avN58IGqjeItHMO0MvbAPQ7D","action_ts":"1694707129.972629","team":{"id":"T05RD573ML3","domain":"magentaproduc-dqe3450"},"user":{"id":"U05QYMSN93R","username":"fabricio.j.repetto","team_id":"T05RD573ML3"},"is_enterprise_install":false,"enterprise":null,"callback_id":"new_activity","trigger_id":"5882852648727.5863177123683.954e0abea1f3924a6d19dc3254473f61"}'
}
 */