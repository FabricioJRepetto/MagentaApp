import { Activity } from "../../types/models/ILogs.interface";

/**
 * Busca el evento previo más cercano en el día actual,
 * de no encontrar uno lo busca en el día anterior.
 * Retorna null si no encuentra ninguno.
 * 
 * @param entries Un arreglo de actividades, perteneciente al día de hoy.
 * @param yesterday (opcional) Un arreglo de actividades, perteneciente al día anterior.
 * @returns Activity | null
 */
export default (entries: Activity[], yesterday?: Activity[]): Activity | null => {
    const now = new Date().getHours();
    let max = 0;
    let prev: Activity | null = null;

    for (const activity of entries) {
        const end = activity.hours.to;

        if (end < now) {
            if (end > max) {
                max = end;
                prev = activity;
            }
        }
    }

    if (prev !== null) { // si encontró un evento previo, retorna
        return prev

    } else if (yesterday && yesterday.length > 0) { // si no busca uno en el día anterior
        let max = 0;
        let aux: Activity | null = null;

        for (const activity of yesterday) {
            const end = activity.hours.to;

            if (end > max) {
                max = end;
                aux = activity;
            }
        }

        if (aux !== null) prev = aux;
    }

    return prev
}