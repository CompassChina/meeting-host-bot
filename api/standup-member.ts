import { VercelRequest, VercelResponse } from "@vercel/node";
import { doStandupMember } from "../command/standup-member";
import { parseSlackArgs } from "../slack/argument-parser";

export default async function (req: VercelRequest, res: VercelResponse) {
    const { name, text, channelId } = req.body;

    if (name !== "/standup-member") {
        res.status(400).send("bad command");
        return;
    }

    const message = await doStandupMember(channelId, parseSlackArgs(text));
    res.status(200).end(message);
}
