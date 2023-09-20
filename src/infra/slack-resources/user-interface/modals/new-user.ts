import { Modal, Blocks, Elements } from 'slack-block-builder';

export default (): string => {
    const modal = Modal({ title: "Crear usuario", submit: "Enviar", close: "cancelar", callbackId: "user_signin" })
        .blocks(
            Blocks.Section({ text: "Completa los datos de tu cuenta para poder comenzar a registrar actividades" }),
            Blocks.Input({ label: "Nombre y Apellido", blockId: "name" }).element(
                Elements.TextInput({
                    actionId: "name_input"
                })
            ),
            Blocks.Divider(),

            Blocks.Input({ label: "Email", blockId: "mail" }).element(
                Elements.TextInput({
                    actionId: "mail_input"
                })
            ),
            Blocks.Input({ label: "Email", blockId: "email" }).element(
                Elements.TextInput({
                    actionId: "email_input"
                })
            ),
            Blocks.Input({ label: "Teléfono", blockId: "phone" }).element(
                Elements.TextInput({
                    actionId: "phone_input"
                })
            )
        ).buildToJSON();

    return modal
}