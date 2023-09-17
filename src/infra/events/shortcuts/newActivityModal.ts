import "dotenv/config"
import newActivity from "../../../user-interface/modals/new-activity";
import axios from "axios";
import qs from "qs";

const { SLACK_BOT_TOKEN } = process.env;

export const openModal = async (trigger_id: string, user: string) => {
    try {
        const args = {
            token: SLACK_BOT_TOKEN,
            trigger_id,
            view: newActivity()
        };

        const result = await axios.post('https://slack.com/api/views.open', qs.stringify(args));

        // console.log('# openModal()', result.data.ok);
        result?.data?.response_metadata?.messages && console.log('error @ openModal()', result.data.response_metadata.messages);
    } catch (error) {
        console.log(error);
    }
};