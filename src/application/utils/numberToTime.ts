/**
 * Convierte un numero decimal a un string de horario 
 * @example 8.35 => '8:35'
 * @param time Horario expresado en número decimal
 * @returns String de horario
 */
export default function first(time: number): string {
    // time < 10 ? "0" + time : "" + time
    let string = time.toFixed(2).toString().split("."),
        hour = parseInt(string[0]),
        min = string[1] || "00",
        aux = "";

    console.log(time);
    console.log(string);


    hour < 10
        ? aux += "0" + hour + ":"
        : aux += hour + ":"

    console.log(min);
    min.length === 1
        ? aux += min + "0"
        : aux += min.slice(0, 2)

    return aux
}