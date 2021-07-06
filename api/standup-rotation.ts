import { VercelRequest, VercelResponse } from "@vercel/node";

interface SlackCommand {
    channel_id: string;
    channel_name: string;
    user_id: string;
    user_name: string;
    command: string;
    text: string;
    response_url: string;
    trigger_id: string;
}

export default async function (req: VercelRequest, res: VercelResponse) {
    const { command, text, response_url } = req.body as SlackCommand;
    console.log("[CMD] Standup Rot", { command, text, response_url });
    res.status(200).send(text);
}
