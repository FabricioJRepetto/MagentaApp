import "dotenv/config"
import { Request, Response } from "express";
import { ActivityValues, ConfigValues, User, UserValues } from "../../types/ViewSubmissionPayload";
import { newActivity, newUser } from "../slack-resources/user-interface/modals";
import Bridge from "../../application/bridge";

export default class InteractionCtrl {
    private bridge;

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

            switch (type) {

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

                    switch (view.callback_id) {
                        case 'user_signin': {
                            try {
                                // Guardar en DB
                                await this.bridge.newUser({
                                    user: <User>user,
                                    values: <UserValues>view.state.values
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
                                    user: <User>user,
                                    values: <ActivityValues>view.state.values
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
                                    user_id: user.id,
                                    values: <ConfigValues>view.state.values
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