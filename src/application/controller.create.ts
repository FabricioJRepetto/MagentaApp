import { ChatPostMessageResponse } from "@slack/web-api";
import RepositoryExternal from "../domain/repository.external";


// interaccion con los repositorios
export class RequestCreator {
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

    public async sendMessage({
        message,
        channel,
    }: {
        message: string;
        channel: string;
    }): Promise<ChatPostMessageResponse> {
        const responseClient = await this.repositoryExternal.sendMsg({ message, channel });
        return responseClient;
    }
}