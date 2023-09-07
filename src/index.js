require('dotenv').config()
const { WebClient } = require('@slack/web-api');

const TOKEN = process.env.SLACK_TOKEN
const GENERAL_ID = 'C05RAAHM077';

const client = new WebClient(TOKEN);

(async () => {
    const result = await client.chat.postMessage({
        text: 'Hello world! :smiley:',
        channel: GENERAL_ID,
    });

    console.log(`Successfully send message ${result.ts} in conversation ${GENERAL_ID}`);

    client.on('message', (data) => {
        console.log(data);
    })
})()
