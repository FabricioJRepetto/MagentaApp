import { ActivityPayload } from "./ActivityPayload"
import { UserPayload } from "./UserPayload"

export default interface dbRepository {
    createUser(data: UserPayload): Promise<any>
    /**
     * Busca un usuario por ID o por SLACK ID
     * 
     * @param user_id ID de base de datos o ID de Slack 
     * @returns 
     */
    getUser(user_id: string): Promise<any>
    saveActivity(data: ActivityPayload): Promise<any>
    getUserActivity(user_id: string): Promise<any>
    checkUserCurrentEvent(user_id: string): Promise<any>
}