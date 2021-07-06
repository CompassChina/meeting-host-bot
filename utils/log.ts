export enum LoggerType {
    Service = "SVC",
    Command = "CMD",
}
class Logger {
    constructor(private readonly name: string, private readonly type: LoggerType = LoggerType.Service) {}

    private get prefix() {
        return `[${this.type}] ${this.name}`;
    }

    log(...message: any[]) {
        console.log(this.prefix, ...message);
    }
    error(...message: any[]) {
        console.error(this.prefix, ...message);
    }
}

export function logger(name: string, type?: LoggerType) {
    return new Logger(name, type);
}
