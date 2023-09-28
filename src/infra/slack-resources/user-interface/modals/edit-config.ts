import { Checkboxes, Divider, Input, Modal, Option, Section, StaticSelect, TimePicker } from "slack-block-builder"
import IConfig from "../../../../types/models/IConfig.interface";
import { dayName } from "../../../../utils";

export default ({ active_hours, active_days, reminder_time, notification }: IConfig): string => {
    const timeFormat = (time: number) => time < 10 ? "0" + time : "" + time + ":00"

    const modal = Modal({ title: "Configuración", submit: "Guardar", close: "volver", callbackId: "edit_config" })
        .blocks(
            Section({ text: "Adapta la app a tus necesidades para que tu experiencia de uso sea lo más placentera posible.\n\n" }),
            Divider(),
            Section({ text: "*Horarios de actividad*" }),
            Section({ text: "Horarios dentro de los que la app puede enviarte notificaciónes\n\n" }),
            Input({ label: "Mi día comienza a las...", blockId: "time_from" }).element(
                TimePicker({
                    initialTime: timeFormat(active_hours.from),
                    placeholder: "desde",
                    actionId: "from"
                })
            ),
            Input({ label: "Y termina a las...", blockId: "time_to" }).element(
                TimePicker({
                    initialTime: timeFormat(active_hours.to),
                    placeholder: "hasta",
                    actionId: "to"
                })
            ),
            Divider(),
            Section({ text: "*Días de actividad*" }),
            Section({ text: "Días en los que la app puede enviarte notificaciónes" }),
            Input({ label: "Quiero registrar actividades los días...", blockId: "days" }).element(
                Checkboxes({ actionId: "selected_days" })
                    .initialOptions(
                        active_days.map(d => Option({ text: dayName(d), value: "" + d }))
                    )
                    .options([
                        Option({ text: "Lunes", value: "1" }),
                        Option({ text: "Martes", value: "2" }),
                        Option({ text: "Miércoles", value: "3" }),
                        Option({ text: "Jueves", value: "4" }),
                        Option({ text: "Viernes", value: "5" }),
                        Option({ text: "Sábado", value: "6" }),
                        Option({ text: "Domingo", value: "0" })
                    ])
            ),
            Divider(),
            Section({ text: "*Tiempo mínimo entre notificaciones*" }),
            Section({ text: "La app va a enviarte notificaciones cuando haya pasado esta cantidad de tiempo sin registros" }),
            Input({ label: "Horas entre registros...", blockId: "reminder" }).element(
                StaticSelect({ actionId: "reminder_select" })
                    .initialOption(Option({ text: `${reminder_time}`, value: `${reminder_time}` }))
                    .options([
                        Option({ text: "1", value: "1" }),
                        Option({ text: "2", value: "2" })
                    ])
            ),
            Divider(),
            Section({ text: "*Notificaciones*" }),
            Section({ text: "Tener en cuenta que la funcionalidad principal de la aplicación es ayudarte a mantener un registro constante mediante las notificaciones." }),
            Input({ label: "¿Recibir notificaciones?", blockId: "notification" }).element(
                StaticSelect({ actionId: "notification_state" })
                    .initialOption(Option({ text: `${notification ? "Si, recibirlas" : "No me molesten"}`, value: `${notification ? "1" : "0"}` }))
                    .options([
                        Option({ text: "No me molesten", value: "0" }),
                        Option({ text: "Si, recibirlas", value: "1" })
                    ])
            )
        )

    return modal.buildToJSON();
}