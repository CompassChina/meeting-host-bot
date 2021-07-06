import { CommandArgumentMap } from "./argument-parser";

export function doStandupRot(argMap: CommandArgumentMap) {
    const { at = "<!here|here>" } = argMap;

    const host = "abc",
        secretary = "xyz";
    return `${at} *站会轮岗*
:microphone: 主持 ${host}
:writing_hand: 记录 ${secretary}`;
}
