import "dotenv/config"
import qs from "qs";
import axios from "axios";
import { homeTab } from "../slack-resources/user-interface/app-home";
import ISlackAPI from "../../types/slack.api.interface";
import IUser, { PopulatedUser } from "../../types/models/IUser.interface";

const { SLACK_BOT_TOKEN } = process.env;

//? Type: Por lo menos un argumento de los siguientes
type messageArgs = {
    attachments: string,
    blocks: string,
    text: string
}
type AtLeastOne<Obj, Keys = keyof Obj> = Keys extends keyof Obj ? Pick<Obj, Keys> : never
type NonEmpty<T> = Partial<T> & AtLeastOne<T>
// Partial<A> & (Pick<A, "foo"> | Pick<A, "bar"> | Pick<A, "baz">)
export type AtLeastOneMessageArg = NonEmpty<messageArgs>

export default class SlackAPI implements ISlackAPI {

    /**
     * 
     * @param trigger_id ID necesaria para responder al evento
     * @param view Modal a mostrar en formato JSON
     */
    public openModal = async (trigger_id: string, view: () => string): Promise<any> => {
        try {
            const args = {
                token: SLACK_BOT_TOKEN,
                trigger_id,
                view: view()
            };

            const result = await axios.post('https://slack.com/api/views.open', qs.stringify(args));

            // console.log('# openModal()', result.data.ok);
            result?.data?.response_metadata?.messages && console.log('error @ openModal() request', result.data.response_metadata.messages);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Envia la view de la app home al usuario indicado. 
     * Si el usuario es nuevo ("newUser") muestra un botón de registro,
     * de otra manera muestra un botó para registrar una actividad y editar configuraciónes.
     *  
     * @param user Slack ID
     * @param user_data Datos de configuración del usuario indicado, o undefined si el usuario es nuevo.
     * 
     */
    public openHome = async (user: string, user_data: PopulatedUser | undefined): Promise<any> => {
        try {
            const args = {
                token: SLACK_BOT_TOKEN,
                user_id: user,
                view: homeTab(user_data)
            };

            const result = await axios.post('https://slack.com/api/views.publish', qs.stringify(args));

            result?.data?.response_metadata?.messages && console.log('error @ openHome() request', result.data.response_metadata.messages);
        } catch (error) {
            console.log(error);
        }
    }

    public sendMessage = async (user_slack_id: string, arg: AtLeastOneMessageArg) => {
        try {
            // You can use their direct message channel ID (as found with im.open, for instance) instead.
            // https://api.slack.com/methods/chat.postMessage

            const args = {
                token: SLACK_BOT_TOKEN,
                channel: user_slack_id,
                ...arg
            };

            const result = await axios.post('https://slack.com/api/chat.postMessage', qs.stringify(args));

            return result;

        } catch (error) {
            console.log(error);
        }
    }

}