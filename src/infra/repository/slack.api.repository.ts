import "dotenv/config"
import qs from "qs";
import axios from "axios";
import newActivity from "../slack-resources/user-interface/modals/new-activity";

const { SLACK_BOT_TOKEN } = process.env;

export const openModal = async (trigger_id: string, user?: string) => {
    //TODO refactor para abrir cualqueir el modal indicado 
    try {
        const args = {
            token: SLACK_BOT_TOKEN,
            trigger_id,
            view: newActivity()
        };

        const result = await axios.post('https://slack.com/api/views.open', qs.stringify(args));

        // console.log('# openModal()', result.data.ok);
        result?.data?.response_metadata?.messages && console.log('error @ openModal() request', result.data.response_metadata.messages);
    } catch (error) {
        console.log(error);
    }
};
