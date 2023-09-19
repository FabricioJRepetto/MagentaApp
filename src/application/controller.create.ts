import { ChatPostMessageResponse } from "@slack/web-api";
import RepositoryExternal from "../types/repository.external";

// interaccion con los repositorios
export class ExternalCreator {
    private repositoryExternal: RepositoryExternal;

    //TODO añador repositorio DB y Google Calendar methods 
    constructor(respositories: [RepositoryExternal]) {
        const [repositoryExternal] = respositories;
        this.repositoryExternal = repositoryExternal;
    }

    public async sayHello(): Promise<ChatPostMessageResponse> {
        const responseClient = await this.repositoryExternal.sayHello();
        return responseClient;
    }

    public async sendMessage({ message, channel }: {
        message: string;
        channel: string;
    }): Promise<ChatPostMessageResponse> {
        const responseClient = await this.repositoryExternal.sendMsg({ message, channel });
        return responseClient;
    }

    public async mention({ user, text, channel }: { user: string; text: string; channel: string }): Promise<ChatPostMessageResponse> {
        const responseClient = await this.repositoryExternal.replyMention({ user, text, channel });
        return responseClient;
    }

    public async openModal({ id, user }: { id: string, user: string }): Promise<any> {
        this.repositoryExternal.openModal(id, user)
    }
}