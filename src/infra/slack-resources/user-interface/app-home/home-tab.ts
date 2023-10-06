import { Button, Divider, HomeTab, Section } from "slack-block-builder"
import { PopulatedUser } from "../../../../types/models/IUser.interface";
import IConfig from "../../../../types/models/IConfig.interface";
import { dayName, numberToTime } from "../../../../application/utils";

export default (user: PopulatedUser | undefined): string => {

    const homeTab = HomeTab({ callbackId: 'main-home', privateMetaData: 'open' }).blocks(
        Section({ text: "*Magenta Productivity App*" }),
    );

    if (user === undefined) {
        homeTab.blocks(
            Section({ text: `:wave: ¡Hola! Parece que es tu primera vez por acá... Para comenzar a utilizar la app primero debes *registrarte en la web* y luego vincular tu *Slack* desde este menú.\n Si no te registraste aún, hacelo en la [WEB](https://magenta-app-dashboard.vercel.app)` })
                .accessory(Button({ text: '¡Vincular!', actionId: 'user_signin' })),
        )
    } else {
        const { active_hours, active_days, reminder_time } = <IConfig>user?.config;

        homeTab.blocks(
            Section({ text: `:date: Registra una nueva actividad o evento.` })
                .accessory(Button({ text: 'Registrar', actionId: 'new_activity' })),
            Divider(),
            Section({
                text: `:identification_card: *Tus datos:*\n
                Nombre: *${user.name}*\n
                Email: *${user.email}*`
            }),
            Divider(),
            Section({
                text: `:gear: *Configura la app para saber en que horarios estás activo y otros detalles.*\n
                Horas de actividad: *${numberToTime(active_hours.from)} - ${numberToTime(active_hours.to)}*\n
                Dias de registro: *${active_days.map(d => dayName(d)).join(', ')}*\n
                Tiempo mínimo entre recordatorios: *${reminder_time < 2 ? '1 hora' : reminder_time + ' horas'}*`
            })
                .accessory(Button({ text: 'Configuración', actionId: 'edit_config' })),
        )
    }

    return homeTab.buildToJSON()
}