import Logger from "./Logger";
import { inject } from "../helpers";
import { Advice } from "./interface";

export type { Advice } from './interface';

export type LogLevel = 'log' | 'warn' | 'error';

export { Logger };

export function log(
    obj: Record<PropertyKey, any>,
    method: PropertyKey,
    adviceMessage: Iterable<[Advice, string]>,
    logLevel: LogLevel = 'log'
): void {
    for (const [advice, message] of adviceMessage) {
        inject(obj, method, [
            [advice, () => console[logLevel](message)]
        ])
    }
}
