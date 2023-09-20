import { ActivityPayload } from "./ActivityPayload"
import { UserPayload } from "./UserPayload"

export default interface dbRepository {
    createUser(data: UserPayload): Promise<any>
    saveActivity(data: ActivityPayload): Promise<any>
    getUserActivity(user_id: string): Promise<any>
    checkUserCurrentEvent(user_id: string): Promise<any>
}