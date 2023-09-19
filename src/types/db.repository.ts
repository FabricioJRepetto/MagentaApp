import { ActivityPayload } from "./ActivityPayload"

export default interface dbRepository {
    saveActivity(data: ActivityPayload): Promise<any>
    getUserActivity(user_id: string): Promise<any>
    checkUserCurrentEvent(user_id: string): Promise<any>
}