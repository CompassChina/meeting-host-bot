import { VercelRequest, VercelResponse } from "@vercel/node";
import { parseSlackArgs } from "../slack/argument-parser";
import { doStandupRot } from "../command/standup-rot";
import { SlackCommand } from "../slack/types";

function error(message: any) {
    console.error("[CMD] Standup Rot", message);
}

export default async function (req: VercelRequest, res: VercelResponse) {
    const { channel_id, command, text, response_url } = req.body as SlackCommand;
    console.log("[CMD] Standup Rot", { command, text, response_url });
    if (command !== "/standup-rot") {
        error(`Bad Command: ${command}`);
        res.status(400).send("bad command");
        return;
    }

    const response = {
        response_type: "in_channel",
        text: await doStandupRot(channel_id, parseSlackArgs(text)),
    };

    res.status(200).send(response);
}
