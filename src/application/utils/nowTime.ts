import timeToNumber from "./timeToNumber";

/**
 * Retorna la hora actual en formato 24 hrs y expresada en decimales
 * 
 * @example 10:43 => 10.43
 */
export default (): number => {
    const time = new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires", hour12: false }),
        now = timeToNumber(time.split(' ')[1]);
    return now
}