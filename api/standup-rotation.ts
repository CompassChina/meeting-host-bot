import { VercelRequest, VercelResponse } from "@vercel/node";
import { parseSlackArgs } from "../slack/argument-parser";
import { doStandupRot } from "../command/standup-rot";
import { SlackCommand } from "../slack/types";
import { logger, LoggerType } from "../utils/log";

const L = logger("Standup Rot", LoggerType.Command);

export default async function (req: VercelRequest, res: VercelResponse) {
    const { channel_id, command, text } = req.body as SlackCommand;
    if (command !== "/standup-rot") {
        L.error(`Bad Command`, command);
        res.status(400).send("bad command");
        return;
    }

    const message = await doStandupRot(channel_id, parseSlackArgs(text));

    res.status(200).send(message);
}
