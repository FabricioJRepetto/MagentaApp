
/**
 * Convierte un string de horario a un numero decimal
 * @example '8:35' => 8.35
 * @param time String de horario
 */
export default (time: string): number => {
    return parseFloat(time.replace(":", "."))
}