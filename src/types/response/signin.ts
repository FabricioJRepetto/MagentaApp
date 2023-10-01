export interface signinRes {
    error: boolean;
    message: string;
    user?: parsedUser;
    token?: string;
}

export interface parsedUser {
    _id: string;
    google_id: string;
    slack_id?: string;
    email: string;
    name: string;
    role: string;
    picture: string | undefined;
}
