import { Button, Message, Section } from "slack-block-builder"

export default (channel: string): string => {
    const message = Message({
        channel,
        text: `Pasó un tiempo desde tu último registro...`,
    }).blocks(
        Section({ text: `:wave: ¿En qué dedicaste la última hora? Haz un nuevo  registro:` })
            .accessory(Button({ text: 'Registrar', actionId: 'button-mark-as-done' }))
    )

    return message.buildToJSON();
}