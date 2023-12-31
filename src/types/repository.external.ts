// Interface implementada por el repository de slack bot
export default interface RepositoryExternal {
    sayHello(): Promise<any>
    sendMsg({ message, channel }: { message: string, channel: string }): Promise<any>
    replyMention({ user, text, channel }: { user: string; text: string; channel: string }): Promise<any>
    openModal(id: string, user?: string): Promise<any>
}