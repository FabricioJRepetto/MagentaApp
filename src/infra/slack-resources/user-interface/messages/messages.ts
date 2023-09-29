import { Blocks, Button, Message, Section } from "slack-block-builder"

export default (user_name: string): string => {
    const message = Message().blocks(
        Section({ text: `:wave: *${user_name} es hora de registrar tu actividad!* \n¿Qué fue lo último que hiciste? \n\n\n` }),
        Section({ text: "_Utiliza \\Actividad o clickea el siguiente botón._" })
            .accessory(Button({ text: 'Registrar!', actionId: 'new_activity' }))
    )
    const blocks = JSON.parse(message.buildToJSON()).blocks

    return JSON.stringify(blocks);
    ;
}