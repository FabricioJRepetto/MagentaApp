import { Modal, Blocks, Elements } from 'slack-block-builder';

export default (): string => {
    const modal = Modal({ title: "Crear usuario", submit: "Enviar", close: "cancelar", callbackId: "user_signin" })
        .blocks(
            Blocks.Section({ text: "Vincula Slack a tu cuenta para poder comenzar a registrar actividades." }),
            Blocks.Section({ text: "Introduce el email con el que *iniciaste sesión* en la web de la app" }),
            Blocks.Divider(),
            Blocks.Input({ label: "Email", blockId: "email" }).element(
                Elements.TextInput({
                    actionId: "email_input",
                    placeholder: " "
                })
            )
        ).buildToJSON();

    return modal
}