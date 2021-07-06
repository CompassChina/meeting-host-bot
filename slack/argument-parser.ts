export type CommandArgumentMap = Record<string, string[]>;

const delimiter = ",";

export function parseSlackArgs(args: string) {
    return args
        .split(delimiter)
        .map((part) => part.trim())
        .filter(Boolean)
        .reduce((map, part) => {
            const bits: string[] = part
                .split(" ")
                .map((bit) => bit.trim())
                .filter(Boolean);
            if (bits && bits.length > 0) {
                const [name, ...values] = bits;
                map[name] = values ?? [];
            }
            return map;
        }, {} as CommandArgumentMap);
}
