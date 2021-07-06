import { connectToDb } from "../db";
import { CommandArgumentMap } from "../slack/argument-parser";
import Chance from "chance";
import { ResponseType, SlackResponse } from "../slack/types";

const helpText = `> :information_desk_person: 站会值日抽签说明:
> - 主持 + 记录: \`/standup_rot\`
> - 只抽主持: \`/standup_rot host\`
> - 只抽记录: \`/standup_rot note\`
> - 指定提醒对象: \`/standup_rot at @Target\` (默认为 \`@here\`)`;

export async function doStandupRot(channelId: string, argMap: CommandArgumentMap): Promise<SlackResponse> {
    const { at = ["<!here|here>"], host, noteTaker, help } = argMap;

    if (help) {
        return { text: helpText };
    }

    const collection = (await connectToDb()).collection("standupMembers");
    const doc = await collection.findOne({
        channelId,
    });

    let members = doc.members;
    let hostUser, secretaryUser;
    const notSpecified = !host && !noteTaker;
    if (notSpecified) {
        const { winner: winner1, remaining } = pickOne(members);
        const { winner: winner2 } = pickOne(remaining);
        hostUser = winner1;
        secretaryUser = winner2;
    } else {
        if (host) {
            const { winner, remaining } = pickOne(members);
            hostUser = winner;
            members = remaining;
        }
        if (noteTaker) {
            const { winner, remaining } = pickOne(members);
            secretaryUser = winner;
            members = remaining;
        }
    }

    const hostLine = `:microphone: 主持 ${hostUser}`;
    const noteTakerLine = `:writing_hand: 记录 ${secretaryUser}`;

    return {
        response_type: ResponseType.ephemeral,
        text: `${at.join(" ")} *今日站会中奖者名单 :tada:*
${[hostLine, noteTakerLine].filter(Boolean).join("\n")}`,
    };
}

function pickOne(pool: string[]): { winner: string; remaining: string[] } {
    if (pool.length === 0) {
        throw new Error("the pool is empty");
    }
    let winner: string;
    let remaining = [...pool];
    if (pool.length === 1) {
        winner = pool[0];
        remaining = [];
    } else {
        const rnd = new Chance(new Date().getTime()).integer({
            min: 0,
            max: pool.length - 1,
        });
        winner = pool[rnd];
        remaining.splice(rnd, 1);
    }
    return { winner, remaining };
}
