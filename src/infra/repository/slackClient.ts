import * as dotenv from 'dotenv'
dotenv.config()

import { ChatPostMessageResponse, WebClient } from '@slack/web-api';
import RepositoryExternal from '../../domain/repository.external';
import newActivity from '../../user-interface/modals/new-activity';

const { SLACK_TOKEN } = process.env;
const GENERAL_ID = 'C05RAAHM077';

// const client = new WebClient(SLACK_TOKEN);

class SlackClient extends WebClient implements RepositoryExternal {
    private status = false;

    constructor() {
        super(SLACK_TOKEN)
        console.log(`\x1b[32m✔ \x1b[0m · Slack API running`)
    }

    async sayHello(): Promise<ChatPostMessageResponse> {
        const res = await this.chat.postMessage({
            text: 'Hello world! :smiley:',
            channel: GENERAL_ID,
        });
        return res;
    }

    async sendMsg({ message, channel }: { message: string; channel: string; }): Promise<ChatPostMessageResponse> {
        const res = await this.chat.postMessage({
            text: message,
            channel: channel,
        });
        return res;
    }

    async replyMention({ user, text, channel }: { user: string; text: string; channel: string }): Promise<ChatPostMessageResponse> {
        //TODO implementar 
        const res = await this.chat.postMessage({
            text: `Hi ${user} :wave: // ${text}`,
            channel
        });

        return res;
    }

    async openModal(trigger_id: string, user?: string): Promise<any> {
        this.views.open({
            trigger_id,
            view: JSON.parse(newActivity(user || 'U05QYMSN93R'))
        })

    }

}

export default SlackClient;