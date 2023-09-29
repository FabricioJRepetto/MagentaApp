import { Activity } from "../../types/models/ILogs.interface";

/**
 * Determina si el usuario tiene un evento en curso.
 * 
 * @param entries Registros de un día; Activity[]
 */
export default (entries: Activity[]): Boolean => {
    const now = new Date().getHours();

    for (const activity of entries) {
        const start = activity.hours.from,
            end = activity.hours.to;
        if (now >= start && now < end) {
            return true
        }
    }
    return false
}