import { Button, Divider, HomeTab, Section } from "slack-block-builder"
import IUser, { PupulatedUser } from "../../../../types/models/IUser.interface";
import IConfig from "../../../../types/models/IConfig.interface";
import { dayName } from "../../../../utils";

export default (user: PupulatedUser | undefined | null): string => {

    const tbd = (arg: any): arg is IConfig => arg.config;

    const config = tbd(user?.config) ? user?.config : null;

    const homeTab = HomeTab({ callbackId: 'main-home', privateMetaData: 'open' }).blocks(
        Section({ text: "*Magenta Productivity App*" }),
        Section({
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\n"
        }),
        Divider()
    );

    if (!user) {
        homeTab.blocks(
            Section({ text: `:wave:* Hola! Al ser un usuario nuevo, debes registrar un par de datos para poder utilizar la app.*` })
                .accessory(Button({ text: 'Registrarme!', actionId: 'user_signin' })),
        )
    } else {
        homeTab.blocks(
            Section({ text: `:date: *Registra una nueva actividad o evento.*` })
                .accessory(Button({ text: 'Registrar', actionId: 'new_activity' })),
            Divider(),
            Section({
                text: `:identification_card: *Tus datos:*\n
                Nombre: ${user.name}\n
                Email: ${user.email}\n
                Teléfono: ${user.phone}`
            }),
            Divider(),
            Section({ text: `:gear: *Configura la app para saber en que horarios estás activo y otros detalles.*` }),
            Section({
                text: `Horas de actividad: ${config?.active_hours.from} - ${config?.active_hours.to}\n
                Dias de registro: ${config?.active_days.map(d => dayName(d)).join(', ')}\n
                Tiempo mínimo entre recordatorios: ${config?.reminder_time! < 2 ? '1 hora' : config?.reminder_time + ' horas'}`
            })
                .accessory(Button({ text: 'Configuración', actionId: 'edit_config' })),
        )
    }

    return homeTab.buildToJSON()
}