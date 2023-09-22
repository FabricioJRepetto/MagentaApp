export default interface ISlackAPI {
    openModal(trigger_id: string, view: () => string): Promise<any>
    openHome(user: string, newUser: boolean): Promise<any>
    sendMessage(): Promise<any>
} 