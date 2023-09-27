/**
 * Implementación de la lógica de los controladores
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
            const userExists = await this.db.getUser(user.id)
            if (userExists) {
                //TODO Si ya existe actualizar con datos faltantes 
                return userExists
            }

            //TODO validar datos 
            const data = this.parseUserData({ user, values })

            const result = await this.db.createSlackUser(data)

            if (result?._id) {
                await this.db.createConfig(result._id, { user_slack_id: user.id })
                await this.db.createLogs(result._id, { user_slack_id: user.id })

                await this.slack.sendMessage(user.id, {
                    text: `:white_check_mark: Registro de usuario exitoso. Bienvenido ${result.name.split(" ")[0]}!`
                })
            } else {
                await this.slack.sendMessage(user.id, {
                    text: ":thinking_face: Algo salió mal..."
                })
            }

            return;
        } catch (error) {
            console.log('error @ Bridge.newSlackUser()', error);
            return error
        }
    }

    /**
     * Crea un nuevo usuario a partir de un login de Google
     * 
     * @param param Un objeto con las propiedades user y values
     * @returns 
     */
    public newGoogleUser = async (payload: any) => {
        try {
            const {
                email,
                name
            } = payload;

            const userExists = await this.db.getUserByEmail(email)
            if (userExists) {
                //TODO Si ya existe actualizar con datos faltantes 
                return userExists
            }

            const result = await this.db.createGoogleUser(payload)

            if (result?._id) {
                await this.db.createConfig(result._id, { email })
                await this.db.createLogs(result._id, { email })

                return `✅ Registro de usuario exitoso. Bienvenido ${name.split(" ")[0]}!`
            } else {
                return "🤔 Algo salió mal..."
            }
        } catch (error) {
            console.log('error @ Bridge.newGoogleUser()', error);
            return error
        }
    }

    async newActivity({ user, values }: { user: User; values: ActivityValues; }) {
        try {
            //TODO validar datos 
            const data = this.parseActivityData({ values });

            //TODO recibir fechas o definir por defecto 
            const day = new Date().toLocaleDateString('en-Us');
            const month = new Date().getMonth();
            const year = new Date().getFullYear();

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

    async notify(): Promise<any> {
        try {
            //TODO 
            /**
             * 1- crear una lista de todos los usuarios filtrada por
             *  - el usuario está activo
             *  - el usuario tiene los recordatorios activos
             *  - estamos dentro de la franja de actividad (dia) 
             *  - estamos dentro de la franja de actividad (hora)
             *  
             *  - ha pasado el tiempo minimo de recordatorio indicado en la config desde el ultimo registro
             *  - no tiene un evento activo en la base de datos
             *  - no tiene un evento activo actualmente en Google Calendar
             */

            const userList = await this.db.getActiveUsers()

            return userList

        } catch (error) {
            console.log('error @ Bridge.openHome()', error);
            return error
        }
    }

    //________________________________________________________

    private parseUserData = ({ user, values }: { user: User, values: UserValues }): UserPayload => {
        try {
            const data = {
                name: values.name.name_input.value,
                email: values.email.email_input.value,
                phone: values.phone.phone_input.value,
                username: user.username,
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
                date: new Date().toISOString().split('T')[0],
                hours: {
                    from: values.time_from.from.selected_time,
                    to: values.time_to.to.selected_time
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
                    from: parseInt(values.time_from.from.selected_time.split(":")[0]),
                    to: parseInt(values.time_to.to.selected_time.split(":")[0])
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