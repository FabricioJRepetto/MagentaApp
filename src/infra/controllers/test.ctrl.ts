import { NextFunction, Request, Response } from "express";
import { ExternalCreator } from "../../application/controller.create";

// Controlador, solo recibe y responde
export default class TestCtrl {
    constructor(private readonly external: ExternalCreator) { }

    public test = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.external.sayHello();

            const message: string = `Successfully successfully greeted (ID ${response.ts}) on "General" channel`
            console.log(response, message);
            res.json({ response, message });

        } catch (err) {
            next(err)
        }
    }

    public send = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            if (!body?.message || !body?.channel) {
                return res.status(403).json({ error: 'message & channel id needed' })
            }

            const response = await this.external.sendMessage(body);

            const message = `Successfully sended message: "${body.message}" (ID ${response.ts}) on channel ID: ${body.channel}`

            console.log(message);
            res.json({ message })

        } catch (err) {
            next(err)
        }
    }

    public mention = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            //TODO implementar
            // console.log(body);

            if (!body?.event) return res.status(400).json({ error: "No event received" })

            /*
                {
                    token: 'avN58IGqjeItHMO0MvbAPQ7D',
                    team_id: 'T05RD573ML3',
                    api_app_id: 'A05RFMNFBD2',
                    event: {
                        client_msg_id: '881606c1-fe0b-4089-8567-39ffb66b59da',
                        type: 'app_mention',
                        text: '<@U05S2QA8Z5E> bienvenido padrino',
                        user: 'U05QYMSN93R',
                        ts: '1694468725.193549',
                        blocks: [ [Object] ],
                        team: 'T05RD573ML3',
                        channel: 'C05RAAHM077',
                        event_ts: '1694468725.193549'
                    },
                    type: 'event_callback',
                    event_id: 'Ev05RT5D2X1T',
                    event_time: 1694468725,
                    authorizations: [
                        {
                        enterprise_id: null,
                        team_id: 'T05RD573ML3',
                        user_id: 'U05S2QA8Z5E',
                        is_bot: true,
                        is_enterprise_install: false
                        }
                    ],
                    is_ext_shared_channel: false,
                    event_context: '4-eyJldCI6ImFwcF9tZW50aW9uIiwidGlkIjoiVDA1UkQ1NzNNTDMiLCJhaWQiOiJBMDVSRk1ORkJEMiIsImNpZCI6IkMwNVJBQUhNMDc3In0'
                }
            */

            const { text, channel } = body.event;

            switch (text) {
                case /test/g.test(text):
                    this.external.sendMessage({ message: "Testeando menciones", channel });

                    break;

                default:
                    this.external.mention(body.event);

                    break;
            }

            res.send(body?.challenge ? body.challenge : body)
        } catch (err) {
            next(err)
        }
    }
}