import { CommandArgumentMap } from "./argument-parser";

export function doStandupRot(argMap: CommandArgumentMap) {
    const { at = "@here" } = argMap;

    const host = "abc",
        secretary = "xyz";
    return `${at} __站会安排__
:microphone: ${host}
:secretary: ${secretary}`;
}
