export interface SlackCommand {
    channel_id: string;
    channel_name: string;
    user_id: string;
    user_name: string;
    command: string;
    text: string;
    response_url: string;
    trigger_id: string;
}

export interface SlackResponse {
    response_type?: ResponseType;
    text: string;
}

export enum ResponseType {
    ephemeral = "ephemeral",
    inChannel = "in_channel",
}
