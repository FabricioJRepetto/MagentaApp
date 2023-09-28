import { Modal, Blocks, Elements, Option } from 'slack-block-builder';

export default (): string => {
    const time = new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }),
        hour = new Date(time).getHours();

    const timeFormat = (time: number): string => {
        const aux = time < 10 ? "0" + time : "" + time + ":00";
        console.log(aux);
        return aux
    }

    const modal = Modal({ title: 'Registrar actividad', submit: 'Enviar', close: "cancelar", callbackId: 'new_activity' })
        .blocks(
            Blocks.Section({ text: "Registra una nueva actividad" }),
            Blocks.Input({ label: 'Description', blockId: 'description' }).element(
                Elements.TextInput({
                    actionId: 'taskTitle',
                    initialValue: '-'
                })
            ),
            Blocks.Divider(),
            Blocks.Input({ label: "Desde", blockId: "time_from" }).element(
                Elements.TimePicker({
                    initialTime: timeFormat(hour),
                    placeholder: "desde",
                    actionId: "from"
                })
            ),
            Blocks.Input({ label: "Hasta", blockId: "time_to" }).element(
                Elements.TimePicker({
                    initialTime: timeFormat(hour + 1),
                    placeholder: "hasta",
                    actionId: "to"
                })
            ),
            Blocks.Divider(),
            Blocks.Input({ label: "Tipo de actividad", blockId: "category" }).element(
                Elements.StaticSelect({ placeholder: "Selecciona una categoría", actionId: "category_select" }).options([
                    Option({ text: "Productividad", value: "PRODUCTIVIDAD" }),
                    Option({ text: "Ocio", value: "OCIO" }),
                    Option({ text: "Descanso", value: "DESCANSO" }),
                    Option({ text: "Autocuidado", value: "AUTOCUIDADO" }),
                    Option({ text: "Inproductividad", value: "INPRODUCTIVIDAD" }),
                ])
            ),
            Blocks.Input({ label: "Actividad", blockId: "subcategory" }).element(
                Elements.StaticSelect({ placeholder: "Selecciona actividad", actionId: "subcategory_select" }).options([
                    Option({ text: "Trabajo", value: "TRABAJO" }),
                    Option({ text: "Estudio", value: "ESTUDIO" }),
                    Option({ text: "Actividad física", value: "ACTIVIDAD_FISICA" }),
                    Option({ text: "Sociales", value: "SOCIALES" }),
                    Option({ text: "Actividades", value: "ACTIVIDADES" }),
                    Option({ text: "Zapping", value: "ZAPPING" }),
                    Option({ text: "Dormir", value: "DORMIR" }),
                    Option({ text: "Meditación", value: "MEDITACION" }),
                    Option({ text: "Comer", value: "COMER" }),
                    Option({ text: "Ducha", value: "DUCHA" }),
                    Option({ text: "Medico", value: "MEDICO" }),
                ])
            ),
            Blocks.Divider(),
            Blocks.Input({ label: "¿Cuánto esfuerzo consideras que te tomó?", blockId: "energy" }).element(
                Elements.RadioButtons({ actionId: "energy_select" }).options([
                    Option({ text: "1", value: "1" }),
                    Option({ text: "2", value: "2" }),
                    Option({ text: "3", value: "3" }),
                    Option({ text: "4", value: "4" }),
                    Option({ text: "5", value: "5" })
                ])
            ),
            Blocks.Divider(),
            Blocks.Input({ label: "¿Cuál fue la emoción que predominó en está actividad?", blockId: "emotion" }).element(
                Elements.RadioButtons({ actionId: "emotion_select" }).options([
                    Option({ text: "Alegría 😀", value: "ALEGRIA" }),
                    Option({ text: "Confianza 😎", value: "CONFIANZA" }),
                    Option({ text: "Miedo 😨", value: "MIEDO" }),
                    Option({ text: "Sorpresa 😲", value: "SORPRESA" }),
                    Option({ text: "Tristeza 😢", value: "TRISTEZA" }),
                    Option({ text: "Tedio 😴", value: "TEDIO" }),
                    Option({ text: "Enfado 😡", value: "ENFADO" }),
                    Option({ text: "Interés 🤩", value: "INTERES" })
                ])
            )
        ).buildToJSON();

    return modal;
};

//? Block kit Options have a maximum length of 10, and most people have more than 10 open tasks at a given time, so we break the openTasks list into chunks of ten and add them as multiple blocks.
