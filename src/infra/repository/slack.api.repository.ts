import "dotenv/config"
import qs from "qs";
import axios from "axios";
import { homeTab } from "../slack-resources/user-interface/app-home";
import ISlackAPI from "../../types/slack.api.interface";
import IUser, { PupulatedUser } from "../../types/models/IUser.interface";

const { SLACK_BOT_TOKEN } = process.env;

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
     */
    public openHome = async (user: string, user_data: PupulatedUser | undefined): Promise<any> => {
        try {
            const args = {
                token: SLACK_BOT_TOKEN,
                user_id: user,
                view: homeTab(user_data)
            };

            const result = await axios.post('https://slack.com/api/views.publish', qs.stringify(args));

            // console.log('# openHome()', result.data.ok);
            result?.data?.response_metadata?.messages && console.log('error @ openHome() request', result.data.response_metadata.messages);
        } catch (error) {
            console.log(error);
        }
    }

    public sendMessage = async () => {
        //TODO Enviar mensaje 
        try {
            // const result = await axios.post('https://slack.com/api/chat.postMessage', qs.stringify(args));

            // return result;

        } catch (error) {
            console.log(error);
        }
    }

}