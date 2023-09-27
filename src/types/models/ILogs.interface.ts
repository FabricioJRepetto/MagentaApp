import { Types } from "mongoose";
import { CATEGORY, EMOTION, SUBCATEGORY } from "../ActivityPayload";

export default interface ILogs {
    user: Types.ObjectId;
    user_slack_id?: string;
    entries: Entry[]
}

export interface Entry {
    month: number;
    year: number;
    days: Day[];
}

export interface Day {
    date: string;
    activity: Activity[]
}

export interface Activity {
    date: string;
    hours: {
        from: string;
        to: string;
    };
    description: string;
    category: CATEGORY,
    subcategory: SUBCATEGORY,
    energy: number,
    emotion: EMOTION,
    gc_event_id?: string
}

//? Estructura del modelo
const example_logs = {
    user: '12312309851', // ObjectID
    entries: [
        {
            month: 9,
            year: 23,
            days: [
                {
                    date: "19-9-2023",
                    activity: [
                        {
                            date: "19-9-2023",
                            hours: {
                                from: "9:00",
                                to: "11:00"
                            },
                            category: "PRODUCTIVIDAD",
                            subcategory: "TRABAJO",
                            energy: 3,
                            emotion: "ALEGRIA",
                            description: "Una descripción.",
                            gc_event_id: "1231654.6546.a56483" // posible id del evento de G calendar
                        },
                        {
                            date: "1-9-2023",
                            hours: {
                                from: "12:00",
                                to: "13:00"
                            },
                            category: "AUTOCUIDADO",
                            subcategory: "COMER",
                            energy: 1,
                            emotion: "ALEGRIA",
                            description: "Descripción del almuerzo.",
                            gc_event_id: "1231654.6546.a56483"
                        }
                    ]
                },
                {
                    date: "20-9-2023",
                    activity: []
                }
            ]
        }
    ]
}