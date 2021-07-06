import { VercelRequest, VercelResponse } from "@vercel/node";
import { parseSlackArgs } from "../command/argument-parser";
import { doStandupRot } from "../command/standup-rot";

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

function error(message: any) {
    console.error("[CMD] Standup Rot", message);
}

export default async function (req: VercelRequest, res: VercelResponse) {
    const { command, text, response_url } = req.body as SlackCommand;
    console.log("[CMD] Standup Rot", { command, text, response_url });
    if (command !== "/standup-rot") {
        error(`Bad Command: ${command}`);
        res.status(400).send("bad command");
        return;
    }

    const response = {
        response_type: "in_channel",
        text: doStandupRot(parseSlackArgs(text)),
    };

    res.status(200).send(response);
}
