import { Modal, Blocks, Elements } from 'slack-block-builder';

export default (): string => {
    const modal = Modal({ title: "Crear usuario", submit: "Enviar", close: "cancelar", callbackId: "user_signin" })
        .blocks(
            Blocks.Section({ text: "Completa los datos de tu cuenta para poder comenzar a registrar actividades" }),
            Blocks.Divider(),

            Blocks.Input({ label: "Nombre y Apellido", blockId: "name" }).element(
                Elements.TextInput({
                    actionId: "name_input",
                    placeholder: " "
                })
            ),
            Blocks.Input({ label: "Email", blockId: "email" }).element(
                Elements.TextInput({
                    actionId: "email_input",
                    placeholder: " "
                })
            ),
            Blocks.Input({ label: "Teléfono", blockId: "phone" }).element(
                Elements.TextInput({
                    actionId: "phone_input",
                    placeholder: " "
                })
            )
        ).buildToJSON();

    return modal
}