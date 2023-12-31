/**
 * Implementación de la lógica de los controladores para SLACK
 * Mediador entre controlador/endpoint y repositorio
 */

import MongoDB from "../infra/repository/mongo.repository"
import SlackAPI from "../infra/repository/slack.api.repository";
import { editConfig } from "../infra/slack-resources/user-interface/modals";
import { UserPayload } from "../types/UserPayload";
import { User, UserValues, ActivityValues, ConfigValues } from "../types/ViewSubmissionPayload";
import dbRepository from "../types/db.repository.interface";
import IConfig, { Config } from "../types/models/IConfig.interface";
import { Activity } from "../types/models/ILogs.interface";
import IUser, { PopulatedUser } from "../types/models/IUser.interface";
import ISlackAPI from "../types/slack.api.interface";
import { timeToNumber } from "./utils";

export default class Bridge {
    private db: dbRepository;
    public slack: ISlackAPI;

    constructor() {
        this.db = new MongoDB();
        this.slack = new SlackAPI();
    }

    /**
     * Crea un nuevo usuario a partir de un formulario de Slack
     * 
     * @param param Un objeto con las propiedades user y values
     * @returns 
     */
    public newSlackUser = async ({ user, values }: { user: User, values: UserValues }) => {
        try {
            //TODO validar datos 
            const data = this.parseUserData({ user, values })

            const userExists = await this.db.getUser(user.id)

            if (userExists) { // Ya hay un usuario con esa slack_id
                if (userExists.email === data.email) {
                    await this.slack.sendMessage(user.id, {
                        text: `:exploding_head: ¡Tus cuentas ya se encuentran vinculadas!`
                    })
                } else {
                    await this.slack.sendMessage(user.id, {
                        text: `:thinking_face: Ya hay una cuenta vinculada a tu Slack... Comprueba si el email es correcto.`
                    })
                }
                return userExists
            }

            const result = await this.db.linkSlackUser(data)

            if (result?._id) {
                await this.slack.sendMessage(user.id, {
                    text: `:handshake: Cuentas vinculadas exitosamente. ¡Ya puedes utilizar todas las funcionalidades de la app!`
                })
            } else {
                await this.slack.sendMessage(user.id, {
                    text: ":thinking_face: Algo salió mal... Parece que no hay una cuenta registrada con ese email."
                })
            }

            return;
        } catch (error) {
            console.log('error @ Bridge.newSlackUser()', error);
            return error
        }
    }

    async newActivity({ user, values }: { user: User; values: ActivityValues; }) {
        try {
            //TODO validar datos 
            const data = this.parseActivityData({ values });

            //TODO recibir fechas o definir por defecto 
            const day = new Date().toLocaleDateString('en', { timeZone: "America/Argentina/Buenos_Aires" });
            const month = new Date(day).getMonth();
            const year = new Date(day).getFullYear();

            await this.db.saveUserActivity(user.id, data, { day, month, year })
                .then(async () => {
                    await this.slack.sendMessage(user.id, {
                        text: ":white_check_mark: Actividad registrada."
                    })
                }).catch(async err => {
                    await this.slack.sendMessage(user.id, {
                        text: `:thinking_face: Algo salió mal...\n ${err}`
                    })
                })

            return;
        } catch (error) {
            console.log('error @ Bridge.newActivity()', error);
            return error
        }
    }

    async getUser(user_id: string): Promise<IUser | undefined> {
        try {
            const user = await this.db.getUser(user_id);
            return user;
        } catch (error) {
            console.log('error @ Bridge.getUser()', error);
            return undefined
        }
    }

    /**
     * Busca un usuario y popula el campo indicado o todos los campos posibles.
     * 
     * @param user_id Db User ID or Slack ID
     * @param path_to_populate "config" o "logs", dejar vacio para popular ambos campos
     * @returns 
     */
    async getPopulatedUser(user_id: string, path_to_populate?: "config" | "logs"): Promise<IUser | undefined> {
        try {
            let user;

            switch (path_to_populate) {
                case 'config':
                    user = await this.db.getUserWithConfig(user_id);
                    break;

                case 'logs':
                    user = await this.db.getUserWithLogs(user_id);
                    break;

                default:
                    user = await this.db.getPopulatedUser(user_id);
                    break;
            }
            return user;

        } catch (error) {
            console.log('error @ Bridge.getPopulatedUser()', error);
            return undefined
        }
    }

    async getUserConfig(user_slack_id: string): Promise<IConfig | undefined> {
        try {
            const config = await this.db.getUserConfig(user_slack_id)
            console.log(config);

            return config

        } catch (error) {
            console.log('error @ Bridge.getUserConfig()', error);
            return undefined
        }
    }

    async editConfig({ user_id, values }: { user_id: string; values: ConfigValues; }) {
        try {
            //TODO validar datos 
            const data = this.parseConfigData({ values });
            await this.db.updateUserConfig(user_id, data)
                .then(async () => {
                    await this.slack.sendMessage(user_id, {
                        text: ":white_check_mark: Configuración actualizada."
                    })
                })
                .catch(async err => {
                    await this.slack.sendMessage(user_id, {
                        text: `:thinking_face: Algo salió mal...\n ${err}`
                    })
                })

            return
        } catch (error) {
            console.log('error @ Bridge.editConfig()', error);
            return error
        }

    }

    /**
     * 
     * @param user_slack_id ID de usuario de Slack.
     * @param action Tipo de evento (callback_id).
     * @param trigger_id trigger_id para responder al evento.
     * @param view Callback que retorna una view en formato JSON.
     * @returns 
     */
    async openModal(user_slack_id: string, action: string, trigger_id: string, view: () => string) {
        try {
            const userFund = await this.db.getUser(user_slack_id)

            switch (action) {

                case "user_signin":
                    if (userFund) {
                        await this.slack.sendMessage(user_slack_id, {
                            text: "Ya estás registrado, no necesitas hacerlo otra vez. Podés editar tus datos en la web."
                        })
                    } else {
                        await this.slack.openModal(trigger_id, view)
                    }
                    break;

                case "new_activity":
                    if (userFund) {
                        await this.slack.openModal(trigger_id, view)
                    } else {
                        await this.slack.sendMessage(user_slack_id, {
                            text: "Pimero debes completar tu cuenta.\n Utiliza \\registrarse o ve a la Home de la aplicación para terminar tu registro de usuario."
                        })
                    }
                    break;

                case "edit_config":
                    if (userFund) {
                        const config = await this.db.getUserConfig(user_slack_id)

                        if (!config) {
                            console.log("error @ interactions -block_actions -edit_config: Config not found");
                            break;
                        }
                        await this.slack.openModal(trigger_id, () => editConfig(config))
                    } else {
                        await this.slack.sendMessage(user_slack_id, {
                            text: "Pimero debes completar tu cuenta.\n Utiliza \\registrarse o ve a la Home de la aplicación para terminar tu registro de usuario."
                        })
                    }

                    break;

                default:
                    break;
            }

        } catch (error) {
            console.log('error @ Bridge.openModal()', error);
            return error
        }
    }

    /**
     * Busca un usuario y su Configuración y abre la View 'Home' (mostrando los datos encontrados o un botón para registrarse) para el usuario.
     * 
     * @param user user Slack ID
     * @returns 
     */
    async openHome(user: string) {
        try {
            // buscar usuario con su Configuracion
            //: popular logs y mostrarlos en home?
            const userData = await this.db.getUserWithConfig(user)
            await this.slack.openHome(user, userData ? <PopulatedUser>userData : undefined);

        } catch (error) {
            console.log('error @ Bridge.openHome()', error);
            return error
        }
    }

    //________________________________________________________

    private parseUserData = ({ user, values }: { user: User, values: UserValues }): UserPayload => {
        try {
            const data = {
                email: values.email.email_input.value,
                slack_id: user.id
            }

            return data;
        } catch (error: any) {
            console.log('error @ parseUserData()', error);
            throw new Error(error);
        }
    }

    private parseActivityData = ({ values }: { values: ActivityValues }): Activity => {
        try {
            const data: Activity = {
                date: new Date().toLocaleDateString('en', { timeZone: "America/Argentina/Buenos_Aires" }),
                hours: {
                    from: timeToNumber(values.time_from.from.selected_time),
                    to: timeToNumber(values.time_to.to.selected_time)
                },
                category: values.category.category_select.selected_option.value,
                subcategory: values.subcategory.subcategory_select.selected_option.value,
                energy: parseInt(values.energy.energy_select.selected_option.value),
                emotion: values.emotion.emotion_select.selected_option.value,
                description: values.description.taskTitle.value
            }

            return data
        } catch (error: any) {
            console.log('error @ parseData()', error);
            throw new Error(error);
        }
    }

    private parseConfigData = ({ values }: { values: ConfigValues }): Config => {
        try {
            const data: Config = {
                active_hours: {
                    from: timeToNumber(values.time_from.from.selected_time),
                    to: timeToNumber(values.time_to.to.selected_time)
                },
                active_days: values.days.selected_days.selected_options.map(e => parseInt(e.value)),
                reminder_time: parseInt(values.reminder.reminder_select.selected_option.value),
                notification: values.notification.notification_state.selected_option.value === "1" ? true : false
            }

            return data
        } catch (error: any) {
            console.log('error @ parseData()', error);
            throw new Error(error);
        }
    }
}