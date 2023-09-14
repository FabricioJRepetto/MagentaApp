import { modals } from "../../../user-interface";

interface shortcut {
    trigger_id: string,
    user: {
        id: string
    }
}
type ack = () => Promise<any>
interface client {
    views: {
        open: ({ }) => Promise<any>
    }
}

// Expose callback function for testing
export const newActivityCallback = async ({ shortcut, ack, client }: { shortcut: shortcut, ack: ack, client: client }): Promise<any> => {
    try {
        await ack();
        await client.views.open({
            trigger_id: shortcut.trigger_id,
            view: modals.newTask(null, shortcut.user.id),
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

