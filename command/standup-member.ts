import { connectToDb } from "../db/mongo";
import { CommandArgumentMap } from "../slack/argument-parser";
import without from "lodash/without";
import union from "lodash/union";
import { SlackResponse } from "../slack/types";

const help = `> 使用如下命令管理站会成员:
> - 添加成员: \`/standup_member add @User1 @User2\`
> - 移除成员: \`/standup_member remove @User1 @User2\``;

export async function doStandupMember(channelId: string, argMap: CommandArgumentMap): Promise<SlackResponse> {
    const { list, add = [], remove = [] } = argMap;
    const collection = (await connectToDb()).collection("standupMembers");
    const doc = await collection.findOne({
        channelId,
    });

    if (list || (add.length === 0 && remove.length === 0)) {
        const hasMember = doc && doc.members && doc.members.length > 0;
        return {
            text: `:people_holding_hands: *本频道站会成员*
${hasMember ? doc.members.join("\n") : "_尚未添加任何站会成员_"}
${help}`,
        };
    }

    const members = doc ? without(union(doc.members, add), ...remove) : without(add, ...remove);
    const memberList = members.join("\n");
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
    return {
        text: `:ok_hand: *频道站会成员已更新*
${memberList}
${help}`,
    };
}
