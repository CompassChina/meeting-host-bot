import { CommandArgumentMap } from "../slack/argument-parser";

export function doStandupRot(argMap: CommandArgumentMap) {
    const { at = "<!here|here>" } = argMap;

    const host = "abc",
        secretary = "xyz";
    return `${at} *今日站会中奖者名单 :tada:*
:microphone: 主持 ${host}
:writing_hand: 记录 ${secretary}`;
}
