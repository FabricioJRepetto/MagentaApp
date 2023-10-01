import { Day, Entry } from "../../types/models/ILogs.interface"

/**
 * Busca una entrada de registros dada determinada fecha.
 *  
 * @param date Fecha en formato string
 * @param entries Registros de un usuario
 * @returns Retorna el objeto Day que coincida con la fecha o null si no hay coincidencias.
 */
export default (date: string, entries: Entry[]): Day | null => {
    const day = new Date(date).toLocaleDateString('en-Us'),
        month = new Date(date).getMonth(),
        year = new Date(date).getFullYear();

    // Buscamos una entrada con la fecha actual (mes-año)
    const targetMonth: Entry | undefined = entries.find(e => e.month === month && e.year === year)

    if (targetMonth) { // Buscamos un día con la fecha actual
        const targetDay = targetMonth.days.find(d => d.date === day)
        if (targetDay) return targetDay
    }
    return null;
}
