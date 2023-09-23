import { CATEGORY, EMOTION, SUBCATEGORY } from "./ActivityPayload"

export interface ViewSubmissionPayload {
    type: string
    team: Team
    user: User
    api_app_id: string
    token: string
    trigger_id: string
    view: View
    response_urls: any[]
    is_enterprise_install: boolean
    enterprise: any
}

export interface Team {
    id: string
    domain: string
}

export interface User {
    id: string
    username: string
    name?: string
    team_id: string
}

export interface View {
    id: string
    team_id: string
    type: string
    blocks: any[][]
    private_metadata: string
    callback_id: string
    state: State
    hash: string
    title: Title
    clear_on_close: boolean
    notify_on_close: boolean
    close: Close
    submit: Submit
    previous_view_id: any
    root_view_id: string
    app_id: string
    external_id: string
    app_installed_team_id: string
    bot_id: string
}

export interface State {
    values: ActivityValues
}

export interface Title {
    type: string
    text: string
    emoji: boolean
}

export interface Close {
    type: string
    text: string
    emoji: boolean
}

export interface Submit {
    type: string
    text: string
    emoji: boolean
}

export interface ActivityValues {
    description: {
        taskTitle: {
            type: string
            value: string
        }
    }
    time_from: {
        from: {
            type: string
            selected_time: string
        }
    }
    time_to: {
        to: {
            type: string
            selected_time: string
        }
    }
    category: {
        category_select: {
            type: string
            selected_option: {
                value: CATEGORY
            }
        }
    }
    subcategory: {
        subcategory_select: {
            type: string
            selected_option: {
                value: SUBCATEGORY
            }
        }
    }
    energy: {
        energy_select: {
            type: string
            selected_option: {
                value: string
            }
        }
    }
    emotion: {
        emotion_select: {
            type: string
            selected_option: {
                value: EMOTION
            }
        }
    }
}

export interface UserValues {
    name: {
        name_input: {
            type: string
            value: string
        }
    },
    email: {
        email_input: {
            type: string
            value: string
        }
    },
    phone: {
        phone_input: {
            type: string
            value: string
        }
    }
}

export interface ConfigValues {
    name: {
        name_input: {
            type: string
            value: string
        }
    },
    email: {
        email_input: {
            type: string
            value: string
        }
    },
    phone: {
        phone_input: {
            type: string
            value: string
        }
    }
}