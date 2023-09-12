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

/*//? Modal submit body ?//
----------------------

user: ????

from: time.from.selected_time,
to: time.to.selected_time,
category: category.category_select.selected_option.value,
subcategory: subcategory.subcategory_select.selected_option.value,
energy: energy.energy_select.selected_option.value,
emotion: emotion.emotion_select.selected_option.value,
description: description.description_text.value

{
  "time": {
    "from": {
      "type": "timepicker",
      "selected_time": "08:00"
    },
    "to": {
      "type": "timepicker",
      "selected_time": "13:00"
    }
  },
  "category": {
    "category_select": {
      "type": "static_select",
      "selected_option": {
        "text": {
          "type": "plain_text",
          "text": "Productividad",
          "emoji": true
        },
        "value": "PRODUCTIVIDAD"
      }
    }
  },
  "subcategory": {
    "subcategory_select": {
      "type": "static_select",
      "selected_option": {
        "text": {
          "type": "plain_text",
          "text": "Sociales",
          "emoji": true
        },
        "value": "SOCIALES"
      }
    }
  },
  "energy": {
    "energy_select": {
      "type": "radio_buttons",
      "selected_option": {
        "text": {
          "type": "plain_text",
          "text": "3",
          "emoji": true
        },
        "value": "3"
      }
    }
  },
  "emotion": {
    "emotion_select": {
      "type": "radio_buttons",
      "selected_option": {
        "text": {
          "type": "plain_text",
          "text": "Sorpresa 😲",
          "emoji": true
        },
        "value": "SORPRESA"
      }
    }
  },
  "description": {
    "description_text": {
      "type": "plain_text_input",
      "value": "desc"
    }
  }
}

*/