import timeToNumber from "./timeToNumber";

/**
 * Retorna la hora actual expresada en decimales
 * 
 * @example 10:43 => 10.43
 */
export default (): number => {
    const time = new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }),
        now = timeToNumber(time.split(' ')[1]);
    return now
}