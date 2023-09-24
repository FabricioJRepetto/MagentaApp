import { PopulatedUser } from "./models/IUser.interface"

export default interface ISlackAPI {
    openModal(trigger_id: string, view: () => string): Promise<any>
    openHome(user: string, user_data: PopulatedUser | undefined | null): Promise<any>
    sendMessage(): Promise<any>
} 