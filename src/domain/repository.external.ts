export default interface RepositoryExternal {
    sayHello(): Promise<any>
    sendMsg({ message, channel }: { message: string, channel: string }): Promise<any>
    replyMention(): Promise<any>
}