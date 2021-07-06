import { connectToDb } from "../db";
import { CommandArgumentMap } from "../slack/argument-parser";
import Chance from "chance";

export async function doStandupRot(channelId: string, argMap: CommandArgumentMap) {
    const { at = "<!here|here>", host, secretary } = argMap;

    const collection = (await connectToDb()).collection("standupMembers");
    const doc = await collection.findOne({
        channelId,
    });
    if (!doc || !doc.members || doc.members.length === 0) {
        return "当前频道中还未设置站会成员，请使用`/standup_member`命令添加成员";
    }

    let members = doc.members;
    let hostUser, secretaryUser;
    const notSpecified = !host && !secretary;
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
        if (secretary) {
            const { winner, remaining } = pickOne(members);
            secretaryUser = winner;
            members = remaining;
        }
    }

    return `${at} *今日站会中奖者名单 :tada:*
:microphone: 主持 ${hostUser}
:writing_hand: 记录 ${secretaryUser}`;
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
