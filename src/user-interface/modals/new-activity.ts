import { Modal, Blocks, Elements, Option } from 'slack-block-builder';

export default (currentUser: string) => {

    const modal = Modal({ title: 'Registrar nueva actividad', submit: 'Enviar', close: "cancelar", callbackId: 'new_activity' })
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
                    initialTime: new Date().getHours() + ":00",
                    placeholder: "desde",
                    actionId: "from"
                })
            ),
            Blocks.Input({ label: "Hasta", blockId: "time_to" }).element(
                Elements.TimePicker({
                    initialTime: new Date().getHours() + 1 + ":00",
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
                Elements.RadioButtons({ actionId: "energy_select" }).options([
                    Option({ text: "Alegría 😀", value: "ALEGRIA" }),
                    Option({ text: "Confianza 😎", value: "CONFIANZA" }),
                    Option({ text: "Miedo 😨", value: "MIEDO" }),
                    Option({ text: "Sorpresa 😲", value: "SORPRESA" }),
                    Option({ text: "Tristeza 😢", value: "TRISTEZA" }),
                    Option({ text: "Tedio 😴", value: "TEDIO" }),
                    Option({ text: "Enfado 😡", value: "ENFADO" }),
                    Option({ text: "Interés 🤩", value: "INTERES" })
                ])
            ),

            Blocks.Input({ label: 'Assign user', blockId: 'taskAssignUser' }).element(
                Elements.UserSelect({
                    actionId: 'taskAssignUser',
                }).initialUser(currentUser),
            ),
        ).buildToJSON();

    return modal;
};
