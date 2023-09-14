import "dotenv/config"
import { NextFunction, Request, Response } from "express";
// import { ExternalCreator } from "../../application/controller.create";
import QueryString from "qs";
import axios from "axios";

import newActivity from "../../user-interface/modals/new-activity";
import { ViewSubmissionPayload } from "../../domain/ViewSubmissionPayload";

const { SLACK_BOT_TOKEN } = process.env;

export default class InteractionCtrl {
    // constructor(private readonly external: ExternalCreator) { }

    public interactionHandler = async ({ body }: Request, res: Response, next: NextFunction) => {
        try {
            const payload = JSON.parse(body.payload)
            // console.log(payload);

            switch (payload.type) {
                case 'url_verification': {
                    // verify Events API endpoint by returning challenge if present
                    res.send({ challenge: payload.challenge });
                    break;
                }
                case 'shortcut': {
                    const { type, user, callback_id, trigger_id } = payload;

                    //TODO Verify the signing secret
                    // if (!signature.isVerified(req)) {
                    //     return res.sendStatus(404);
                    // }

                    if (callback_id === "new_activity") {
                        await openModal(trigger_id, user.id)
                        res.sendStatus(200)
                    }

                    // Triggered when the App Home is opened by a user
                    if (type === 'app_home_opened') {
                        // Display App Home
                        // res.sendStatus(200)
                    }

                }
                case 'view_submission': {
                    try {
                        const { user, view: { state: { values } } }: ViewSubmissionPayload = payload;
                        // console.log(values);

                        const data = {
                            user,
                            description: values.description.taskTitle.value,
                            from: values.time_from.from.selected_time,
                            to: values.time_to.to.selected_time,
                            category: values.category.category_select.selected_option.value,
                            subcategory: values.subcategory.subcategory_select.selected_option.value,
                            energy: values.energy.energy_select.selected_option.value,
                            emotion: values.emotion.emotion_select.selected_option.value
                        }
                        // appHome.displayHome(user.id, data);
                        console.log('submited data: ', data);
                        //TODO Guardar en DB 
                        //TODO Sincronizar Google Calendar 

                        //TODO Close view 
                        // https://api.slack.com/surfaces/modals#lifecycle

                        return res.sendStatus(200)

                    } catch (error) {
                        console.log(error);
                        return res.sendStatus(400)
                    }
                }
            }

        } catch (err) {
            res.status(400).send(err)
        }
    }
}

const openModal = async (trigger_id: string, user: string) => {
    try {
        const args = {
            token: SLACK_BOT_TOKEN,
            trigger_id,
            view: newActivity(user)
        };

        const result = await axios.post('https://slack.com/api/views.open', QueryString.stringify(args));

        console.log(result.data);
        result?.data?.response_metadata?.messages && console.log(result.data.response_metadata.messages);
    } catch (error) {
        console.log(error);
    }

};


/*//? Payload ?//

    {
    "type": "shortcut",
    "token": "XXXXXXXXXXXXX",
    "action_ts": "1581106241.371594",
    "team": {
        "id": "TXXXXXXXX",
        "domain": "shortcuts-test"
    },
    "user": {
        "id": "UXXXXXXXXX",
        "username": "aman",
        "team_id": "TXXXXXXXX"
    },
    "callback_id": "shortcut_create_task",
    "trigger_id": "944799105734.773906753841.38b5894552bdd4a780554ee59d1f3638"
    } 

    {
  payload: '{"type":"shortcut","token":"avN58IGqjeItHMO0MvbAPQ7D","action_ts":"1694707129.972629","team":{"id":"T05RD573ML3","domain":"magentaproduc-dqe3450"},"user":{"id":"U05QYMSN93R","username":"fabricio.j.repetto","team_id":"T05RD573ML3"},"is_enterprise_install":false,"enterprise":null,"callback_id":"new_activity","trigger_id":"5882852648727.5863177123683.954e0abea1f3924a6d19dc3254473f61"}'
}

//? Modal submit body ?//

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