/**
 * Convierte un numero decimal a un string de horario 
 * @example 8.35 => '8:35'
 * @param time Horario expresado en número decimal
 * @returns String de horario
 */
export default (time: number): string => {
    // time < 10 ? "0" + time : "" + time
    let string = time.toString().split("."),
        hour = parseInt(string[0]),
        min = string[1] || "00",
        aux = "";

    hour < 10
        ? aux += "0" + hour + ":"
        : aux += hour + ":"

    min.length === 1
        ? aux += min + "0"
        : aux += min

    return aux
}
