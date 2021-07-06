import { connectToDb } from "../db/mongo";
import { CommandArgumentMap } from "../slack/argument-parser";
import without from "lodash/without";
import union from "lodash/union";

export async function doStandupMember(channelId: string, argMap: CommandArgumentMap) {
    const { list, add = [], remove = [] } = argMap;
    const collection = (await connectToDb()).collection("standupMembers");
    const doc = await collection.findOne({
        channelId,
    });

    const members = doc ? without(union(doc.members, add), ...remove) : without(add, ...remove);
    const memberList = members.join("\n");
    if (list) {
        return `:people_holding_hands: *本频道站会成员*\n${memberList}`;
    }
    if (!doc) {
        await collection.insertOne({
            channelId,
            members,
        });
    } else {
        await collection.findOneAndUpdate(
            {
                channelId,
            },
            {
                $set: { members },
            }
        );
    }
    return `:ok_hand: *频道站会成员已更新*\n${memberList}`;
}
