import "dotenv/config"
import { NextFunction, Request, Response } from "express";
import { ActivityValues, ConfigValues, User, UserValues } from "../../types/ViewSubmissionPayload";
import { newActivity, newUser } from "../slack-resources/user-interface/modals";
import Bridge from "../../application/bridge";
import editConfig from "../slack-resources/user-interface/modals/edit-config";

export default class InteractionCtrl {
    private bridge;
    // constructor(private readonly bridge: Bridge) { }
    constructor() {
        this.bridge = new Bridge();
    }

    public interactionHandler = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            //TODO REFACTOR: separar endpoints para eventos con y sin payload 

            //? Eventos SIN Payload _______________
            // verificar API para eventos de Slack
            if (body?.type === 'url_verification') {
                return res.send({ challenge: body.challenge });
            } else if (body?.type === 'event_callback') {
                //? Abre la Home
                if (body.event.type === 'app_home_opened') {
                    // buscar usuario
                    const newUser = await this.bridge.getUser(body.event.user)
                    await this.bridge.openHome(body.event.user, !Boolean(newUser));
                    return res.send()
                }
            }

            //? SLASH COMMANDS _______________
            const payload = JSON.parse(body.payload);
            const { type, view, user, callback_id, trigger_id, actions } = payload;

            switch (payload.type) {
                case 'shortcut': {
                    //TODO Verify the signing secret 
                    // if (!signature.isVerified(req)) {
                    //     return res.sendStatus(404);
                    // }

                    //? Abre el modal para registrar usuario
                    if (callback_id === "user_signin") {
                        await this.bridge.openModal(trigger_id, newUser)
                        return res.send()
                    }

                    //? Abre el modal para registrar actividad
                    if (callback_id === "new_activity") {
                        await this.bridge.openModal(trigger_id, newActivity)
                        return res.send()
                    }
                }

                //? BOTONES
                case 'block_actions': {
                    if (actions) {

                        switch (actions[0].action_id) {
                            //? Boton de registro de usuario de la App Home
                            case "user_signin": {
                                await this.bridge.openModal(trigger_id, newUser)
                                return res.send()
                            }

                            //? Boton de configuración en la App Home
                            case "edit_config": {
                                const config = await this.bridge.getUserConfig(user.id)

                                if (!config) {
                                    console.log(config);
                                    console.log("error @ interactions -block_actions -edit_config: Config not found");
                                    return res.status(400).send("error @interactions -block_actions -edit_config: Config not found")
                                }

                                await this.bridge.openModal(trigger_id, () => editConfig(config))
                                return res.send()
                            }

                            default:
                                break;
                        }
                    }
                }

                //? SUBMITS
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
                                //TODO Si la view desde donde se envío el form esla home, actualizarla 
                                if (view.type === "home") { }
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

                        case 'edit_config': {
                            try {
                                // Guardar en DB
                                const response = await this.bridge.editConfig({
                                    user_id: payload.user.id,
                                    values: <ConfigValues>payload.view.state.values
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