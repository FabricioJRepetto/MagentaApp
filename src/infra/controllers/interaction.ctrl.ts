import "dotenv/config"
import { NextFunction, Request, Response } from "express";
import { ActivityValues, ConfigValues, User, UserValues } from "../../types/ViewSubmissionPayload";
import { newActivity, newUser } from "../slack-resources/user-interface/modals";
import Bridge from "../../application/bridge";
import { PopulatedUser } from "../../types/models/IUser.interface";

export default class InteractionCtrl {
    private bridge;
    // constructor(private readonly bridge: Bridge) { }
    constructor() {
        this.bridge = new Bridge();
    }

    public interactionHandler = async ({ body }: Request, res: Response) => {
        try {
            //? Eventos SIN Payload _______________

            // verificar API para eventos de Slack
            if (body?.type === 'url_verification') {
                return res.send({ challenge: body.challenge });
            } else if (body?.type === 'event_callback') {
                //? Abre la Home
                if (body.event.type === 'app_home_opened') {
                    // buscar usuario
                    // const user = await this.bridge.getPopulatedUser(body.event.user, "config")
                    await this.bridge.openHome(body.event.user);
                    return res.send()
                }
            }

            //? Eventos CON Payload _______________

            const payload = JSON.parse(body.payload);
            const { type, view, user, callback_id, trigger_id, actions } = payload;

            switch (payload.type) {

                // COMANDOS
                case 'shortcut': {
                    //TODO Verify the signing secret 
                    // if (!signature.isVerified(req)) {
                    //     return res.sendStatus(404);
                    // }

                    //? Abre el modal para registrar usuario
                    if (callback_id === "user_signin") {
                        await this.bridge.openModal(user.id, "user_signin", trigger_id, newUser)
                        return res.send()
                    }

                    //? Abre el modal para registrar actividad
                    if (callback_id === "new_activity") {
                        await this.bridge.openModal(user.id, "new_activity", trigger_id, newActivity)
                        return res.send()
                    }
                }

                // BOTONES
                case 'block_actions': {
                    if (actions) {

                        switch (actions[0].action_id) {
                            //? Boton Registro de usuario de la App Home
                            case "user_signin": {
                                await this.bridge.openModal(user.id, "user_signin", trigger_id, newUser)
                                return res.send()
                            }
                            //? Boton Nueva Actividad de la App Home
                            case "new_activity": {
                                await this.bridge.openModal(user.id, "new_activity", trigger_id, newActivity)
                                return res.send()
                            }

                            //? Boton Editar Configuración en la App Home
                            case "edit_config": {
                                await this.bridge.openModal(user.id, "edit_config", trigger_id, () => "")
                                return res.send()
                            }

                            default:
                                console.log("!! switch: case: 'block_actions' action:  default case");
                                break;
                        }
                    }
                }

                // SUBMITS
                case 'view_submission': {

                    switch (payload.view.callback_id) {
                        case 'user_signin': {
                            try {
                                // Guardar en DB
                                await this.bridge.newUser({
                                    user: <User>payload.user,
                                    values: <UserValues>payload.view.state.values
                                })
                                return res.send()

                            } catch (error) {
                                console.log(error);
                                return res.status(400).send(error)
                            }
                        }

                        case 'new_activity': {
                            try {
                                // Guardar en DB
                                //TODO Y sincronizar Google Calendar 
                                await this.bridge.newActivity({
                                    user: <User>payload.user,
                                    values: <ActivityValues>payload.view.state.values
                                })
                                return res.send()

                            } catch (error) {
                                console.log(error);
                                return res.status(400).send(error)
                            }
                        }

                        case 'edit_config': {
                            try {
                                // Guardar en DB
                                await this.bridge.editConfig({
                                    user_id: payload.user.id,
                                    values: <ConfigValues>payload.view.state.values
                                })
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