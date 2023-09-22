import "dotenv/config"
import { NextFunction, Request, Response } from "express";
import { ActivityValues, User, UserValues } from "../../types/ViewSubmissionPayload";
import { openHome, openModal } from "../repository/slack.api.repository";
import { newActivity, newUser } from "../slack-resources/user-interface/modals";
import Bridge from "../../application/bridge";

export default class InteractionCtrl {
    private bridge;
    // constructor(private readonly bridge: Bridge) { }
    constructor() {
        this.bridge = new Bridge();
    }

    public interactionHandler = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            const payload = JSON.parse(body.payload)
            console.log(payload);
            const { type, user, callback_id, trigger_id } = payload;

            switch (payload.type) {
                // verificar API para eventos de Slack
                case 'url_verification': {
                    res.send({ challenge: payload.challenge });
                    break;
                }
                case 'shortcut': {

                    //TODO Verify the signing secret 
                    // if (!signature.isVerified(req)) {
                    //     return res.sendStatus(404);
                    // }

                    //? Abre el modal para registrar usuario
                    if (callback_id === "user_signin") {
                        await openModal(trigger_id, newUser)
                        return res.send()
                    }

                    //? Abre el modal para registrar actividad
                    if (callback_id === "new_activity") {
                        await openModal(trigger_id, newActivity)
                        return res.send()
                    }
                }

                case 'event_callback': {
                    //: Abre la Home
                    if (type === 'app_home_opened') {
                        await openHome(user.id);
                        return res.send()
                    }
                }

                case 'view_submission': {

                    switch (payload.view.callback_id) {
                        case 'user_signin': {
                            try {
                                // Guardar en DB
                                const response = await this.bridge.newUser({
                                    user: <User>payload.user,
                                    values: <UserValues>payload.view.state.values
                                })
                                //: Sincronizar Google Calendar al crear usuario?
                                //TODO enviar/mostrar mensaje de confirmación 

                                return res.send()

                            } catch (error) {
                                console.log(error);
                                return res.status(400).send(error)
                            }
                        }

                        case 'new_activity': {
                            try {
                                // Guardar en DB
                                const response = await this.bridge.newActivity({
                                    user: <User>payload.user,
                                    values: <ActivityValues>payload.view.state.values
                                })
                                // console.log('# view_submission switch: data', data);
                                //TODO Sincronizar Google Calendar 
                                //TODO enviar/mostrar mensaje de confirmación 

                                return res.send()

                            } catch (error) {
                                console.log(error);
                                return res.status(400).send(error)
                            }
                        }

                        default:
                            break;
                    }
                }

                default:
                    return

            }

        } catch (err) {
            console.log(err);
            res.status(400).send(err)
        }
    }
}

/*//? Payload ?//
    {
        "type":"shortcut",
        "token":"avN58IGqjeItHMO0MvbAPQ7D",
        "action_ts":"1694707129.972629",
        "team":{
            "id":"T05RD573ML3",
            "domain":"magentaproduc-dqe3450"
        },
        "user":{
            "id":"U05QYMSN93R",
            "username":"fabricio.j.repetto",
            "team_id":"T05RD573ML3"
        },
        "is_enterprise_install":false,
        "enterprise":null,
        "callback_id":"new_activity",
        "trigger_id":"5882852648727.5863177123683.954e0abea1f3924a6d19dc3254473f61"
    }

//? Modal submit body ?//
    {
        "time": {
            "from": {
            "type": "timepicker",
            "selected_time": "08:00"
            },
            "to": {
            "type": "timepicker",
            "selected_time": "13:00"
            }
        },
        "category": {
            "category_select": {
            "type": "static_select",
            "selected_option": {
                "text": {
                "type": "plain_text",
                "text": "Productividad",
                "emoji": true
                },
                "value": "PRODUCTIVIDAD"
            }
            }
        },
        "subcategory": {
            "subcategory_select": {
            "type": "static_select",
            "selected_option": {
                "text": {
                "type": "plain_text",
                "text": "Sociales",
                "emoji": true
                },
                "value": "SOCIALES"
            }
            }
        },
        "energy": {
            "energy_select": {
            "type": "radio_buttons",
            "selected_option": {
                "text": {
                "type": "plain_text",
                "text": "3",
                "emoji": true
                },
                "value": "3"
            }
            }
        },
        "emotion": {
            "emotion_select": {
            "type": "radio_buttons",
            "selected_option": {
                "text": {
                "type": "plain_text",
                "text": "Sorpresa 😲",
                "emoji": true
                },
                "value": "SORPRESA"
            }
            }
        },
        "description": {
            "description_text": {
            "type": "plain_text_input",
            "value": "desc"
            }
        }
    }

*/