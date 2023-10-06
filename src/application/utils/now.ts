/**
 * Retorna la hora actual en formato de 24 hrs.
 */
export default (): string => {
    return new Date().toLocaleString('en', { timeZone: "America/Argentina/Buenos_Aires", hour12: false }).split(' ')[1]
}