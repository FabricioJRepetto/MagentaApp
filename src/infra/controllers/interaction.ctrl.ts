import "dotenv/config"
import { NextFunction, Request, Response } from "express";
// import { ExternalCreator } from "../../application/controller.create";
import { User, Values } from "../../domain/ViewSubmissionPayload";
import { ActivityPayload } from "../../domain/ActivityPayload";
import { openModal } from "../listeners/shortcuts/newActivityModal";

export default class InteractionCtrl {
    // constructor(private readonly external: ExternalCreator) { }

    public interactionHandler = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            const payload = JSON.parse(body.payload)
            // console.log(payload);

            switch (payload.type) {
                case 'url_verification': {
                    // verify Events API endpoint by returning challenge if present
                    res.send({ challenge: payload.challenge });
                    break;
                }
                case 'shortcut': {
                    const { type, user, callback_id, trigger_id } = payload;

                    //TODO Verify the signing secret 
                    // if (!signature.isVerified(req)) {
                    //     return res.sendStatus(404);
                    // }

                    //? Abre el modal para registrar actividad
                    if (callback_id === "new_activity") {
                        await openModal(trigger_id, user.id)
                        return res.send()
                    }

                    // Triggered when the App Home is opened by a user
                    if (type === 'app_home_opened') {
                        // Display App Home
                        // return res.send()
                    }

                }
                case 'view_submission': {
                    try {
                        const data = parseData({
                            user: payload.user,
                            values: payload.view.state.values
                        })
                        // console.log('# view_submission switch: data', data);
                        //TODO Guardar en DB 
                        //TODO Sincronizar Google Calendar 

                        return res.send()

                    } catch (error) {
                        console.log(error);
                        return res.status(400).send(error)
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

const parseData = ({ user, values }: { user: User, values: Values }): ActivityPayload | undefined => {
    // console.log('# parseData() values', values);
    try {
        const data = {
            user,
            description: values.description.taskTitle.value,
            from: values.time_from.from.selected_time,
            to: values.time_to.to.selected_time,
            category: values.category.category_select.selected_option.value,
            subcategory: values.subcategory.subcategory_select.selected_option.value,
            energy: parseInt(values.energy.energy_select.selected_option.value),
            emotion: values.emotion.emotion_select.selected_option.value
        }

        return data
    } catch (error) {
        console.log('error @ parseData()', error);
        return
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